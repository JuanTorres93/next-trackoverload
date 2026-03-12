import { render, screen } from '@testing-library/react';

// Mock before importing the component that uses next/cache
import '@/../tests/mocks/nextjs';

import { DayEntry } from '@/application-layer/use-cases/day/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecase';
import { createMultipleMockDaysWithWeights } from '../../../../../tests/mocks/days';
import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { MemoryDaysRepo } from '@/infra/repos/memory/MemoryDaysRepo';

import WeightTracker from '../WeightTracker';

const daysRepo = AppDaysRepo as MemoryDaysRepo;

async function createMockDays(): Promise<DayEntry[]> {
  const mockDays = await createMultipleMockDaysWithWeights(7);

  const dayEntries: DayEntry[] = mockDays.map((day) => ({
    date: day.id,
    day: day,
  }));

  return dayEntries;
}

async function setup() {
  daysRepo.clearForTesting();
  const days = await createMockDays();

  render(<WeightTracker days={days} />);

  return { days };
}

describe('WeightTracker', () => {
  it('renders the weight input', async () => {
    await setup();

    expect(screen.getByText(/input peso/i)).toBeInTheDocument();
  });

  it('renders the weight history', async () => {
    await setup();

    expect(screen.getByText(/history/i)).toBeInTheDocument();
  });
});
