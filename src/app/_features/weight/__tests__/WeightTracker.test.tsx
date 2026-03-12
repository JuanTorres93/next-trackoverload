import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock before importing the component that uses next/cache
import '@/../tests/mocks/nextjs';

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

  return { days, lastDayEntry };
}

describe('WeightTracker', () => {
  it('renders current weight in input if it exists', async () => {
    const { lastDayEntry } = await setup();

    const lastDay = lastDayEntry.day;

    const input = screen.getByRole('textbox');

    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(String(lastDay!.userWeightInKg));
  });

  it('renders placeholder text if no weight exists', async () => {
    await setup(true);

    const input = screen.getByRole('textbox');

    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('');

    expect(input.getAttribute('placeholder')).toMatch(/kg/i);
  });

  it('should update user weight in repo', async () => {
    const { lastDayEntry } = await setup();

    const input = screen.getByRole('textbox');

    await userEvent.clear(input);
    await userEvent.type(input, '1300');

    await waitFor(async () => {
      const updatedDay = await daysRepo.getDayById(lastDayEntry.date);

      expect(updatedDay?.userWeightInKg).toBe(1300);
    });
  });

  it('should update user weight in repo if it had no previous value', async () => {
    const { lastDayEntry } = await setup(true);

    const input = screen.getByRole('textbox');

    await userEvent.clear(input);
    await userEvent.type(input, '1300');

    await waitFor(async () => {
      const updatedDay = await daysRepo.getDayById(lastDayEntry.date);

      expect(updatedDay?.userWeightInKg).toBe(1300);
    });
  });
});
