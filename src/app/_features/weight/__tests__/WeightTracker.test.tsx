import { render, screen } from '@testing-library/react';

// Mock before importing the component that uses next/cache
import '@/../tests/mocks/nextjs';
import { TEST_USER_ID } from '@/../tests/mocks/nextjs';

import { DayEntry } from '@/application-layer/use-cases/day/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecase';
import WeightTracker from '../WeightTracker';

function createMockDayEntry(overrides: Partial<DayEntry> = {}): DayEntry {
  return {
    date: '20260311',
    day: {
      id: '20260311',
      userId: TEST_USER_ID,
      mealIds: [],
      fakeMealIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userWeightInKg: 75,
      day: 11,
      month: 3,
      year: 2026,
    },
    ...overrides,
  };
}

async function setup(days: DayEntry[] = [createMockDayEntry()]) {
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

  it('renders with empty days array', async () => {
    await setup([]);

    expect(screen.getByText(/input peso/i)).toBeInTheDocument();
    expect(screen.getByText(/history/i)).toBeInTheDocument();
  });

  it('renders with a day entry without weight data', async () => {
    const dayWithNoWeight = createMockDayEntry({ day: null });
    await setup([dayWithNoWeight]);

    expect(screen.getByText(/input peso/i)).toBeInTheDocument();
    expect(screen.getByText(/history/i)).toBeInTheDocument();
  });
});
