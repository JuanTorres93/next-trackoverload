import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DayEntry } from '@/application-layer/use-cases/day/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecase';
import { createMultipleMockDaysWithWeights } from '../../../../../tests/mocks/days';
import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { MemoryDaysRepo } from '@/infra/repos/memory/MemoryDaysRepo';

import WeightTracker from '../WeightTracker';
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

async function setup(removeLastDayWeight = false) {
  daysRepo.clearForTesting();

  const days = await createMockDays();
  const lastDayEntry = days[days.length - 1];

  if (removeLastDayWeight) {
    const lastDay = lastDayEntry.day;

    lastDay!.userWeightInKg = undefined;

    const day = fromDayDTO(lastDay!);

    await daysRepo.saveDay(day);
  }

  render(<WeightTracker days={days} />);

  const weightInput = screen.getByTestId('input-weight');

  return { days, lastDayEntry, weightInput };
}

describe('WeightTracker', () => {
  it('renders current weight in input if it exists', async () => {
    const { lastDayEntry, weightInput } = await setup();

    const lastDay = lastDayEntry.day;

    expect(weightInput).toBeInTheDocument();
    expect(weightInput).toHaveValue(String(lastDay!.userWeightInKg));
  });

  it('renders placeholder text if no weight exists', async () => {
    const { weightInput } = await setup(true);

    expect(weightInput).toBeInTheDocument();
    expect(weightInput).toHaveValue('');

    expect(weightInput.getAttribute('placeholder')).toMatch(/kg/i);
  });

  it('should update user weight in repo', async () => {
    const { lastDayEntry, weightInput } = await setup();

    await userEvent.clear(weightInput);
    await userEvent.type(weightInput, '1300');

    await waitFor(async () => {
      const updatedDay = await daysRepo.getDayById(lastDayEntry.date);

      expect(updatedDay?.userWeightInKg).toBe(1300);
    });
  });

  it('should update user weight in repo if it had no previous value', async () => {
    const { lastDayEntry, weightInput } = await setup(true);

    await userEvent.clear(weightInput);
    await userEvent.type(weightInput, '1300');

    await waitFor(async () => {
      const updatedDay = await daysRepo.getDayById(lastDayEntry.date);

      expect(updatedDay?.userWeightInKg).toBe(1300);
    });
  });
});
