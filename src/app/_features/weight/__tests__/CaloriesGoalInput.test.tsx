import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DayEntry } from '@/application-layer/use-cases/day/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecase';
import { createMultipleMockDaysWithWeights } from '../../../../../tests/mocks/days';
import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { MemoryDaysRepo } from '@/infra/repos/memory/MemoryDaysRepo';
import { AppSetCaloriesGoalForDayAndUserUsecase } from '@/interface-adapters/app/use-cases/day';

import CaloriesGoalInput from '../CaloriesGoalInput';
import { fromDayDTO } from '@/application-layer/dtos/DayDTO';

const daysRepo = AppDaysRepo as MemoryDaysRepo;

async function createMockDays(): Promise<DayEntry[]> {
  const mockDays = await createMultipleMockDaysWithWeights(7);

  const dayEntries: DayEntry[] = mockDays.map((day) => ({
    date: day.id,
    day: day,
  }));

  return dayEntries;
}

async function setup(withCaloriesGoal = true) {
  daysRepo.clearForTesting();

  const days = await createMockDays();
  const lastDayEntry = days[days.length - 1];

  if (withCaloriesGoal) {
    const lastDay = lastDayEntry.day!;

    const updatedDay = await AppSetCaloriesGoalForDayAndUserUsecase.execute({
      dayId: lastDay.id,
      userId: lastDay.userId,
      newCaloriesGoal: 2000,
    });

    lastDayEntry.day = updatedDay;
  } else {
    const lastDay = lastDayEntry.day!;
    lastDay.updatedCaloriesGoal = undefined;

    const day = fromDayDTO(lastDay);
    await daysRepo.saveDay(day);
  }

  render(<CaloriesGoalInput lastDay={lastDayEntry} />);

  return { days, lastDayEntry };
}

describe('CaloriesGoalInput', () => {
  it('renders current calories goal in input if it exists', async () => {
    const { lastDayEntry } = await setup(true);

    const input = screen.getByRole('textbox');

    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(String(lastDayEntry.day!.updatedCaloriesGoal));
  });

  it('renders placeholder text if no calories goal exists', async () => {
    await setup(false);

    const input = screen.getByRole('textbox');

    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('');

    expect(input.getAttribute('placeholder')).toMatch(/kcal/i);
  });

  it('should update calories goal in repo', async () => {
    const { lastDayEntry } = await setup(true);

    const input = screen.getByRole('textbox');

    await userEvent.clear(input);
    await userEvent.type(input, '2500');

    await waitFor(async () => {
      const updatedDay = await daysRepo.getDayById(lastDayEntry.date);

      expect(updatedDay?.updatedCaloriesGoal).toBe(2500);
    });
  });

  it('should update calories goal in repo if it had no previous value', async () => {
    const { lastDayEntry } = await setup(false);

    const input = screen.getByRole('textbox');

    await userEvent.clear(input);
    await userEvent.type(input, '2500');

    await waitFor(async () => {
      const updatedDay = await daysRepo.getDayById(lastDayEntry.date);

      expect(updatedDay?.updatedCaloriesGoal).toBe(2500);
    });
  });
});
