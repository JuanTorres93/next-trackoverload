import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AssembledDayResult } from '@/app/_features/day/actions';
import { DayId } from '@/domain/value-objects/DayId/DayId';
import MealsDisplay from '../MealsDisplay';

// Build a sequence of past days to prevent the useEffect from overriding activeDayIndex
function createAssembledDays(count: number): AssembledDayResult[] {
  return Array.from({ length: count }, (_, i) => ({
    dayId: DayId.create({ day: i + 1, month: 1, year: 2025 }).value,
    assembledDay: null,
  }));
}

function getActiveTabs() {
  return screen
    .getAllByRole('button')
    .filter((btn) => btn.getAttribute('aria-current') === 'date');
}

function getMobileDayView() {
  return screen.getByTestId('mobile-day-view');
}

function swipeLeft(element: HTMLElement, distance = 100) {
  fireEvent.touchStart(element, { touches: [{ clientX: 300, clientY: 0 }] });
  fireEvent.touchEnd(element, {
    changedTouches: [{ clientX: 300 - distance, clientY: 0 }],
  });
}

function swipeRight(element: HTMLElement, distance = 100) {
  fireEvent.touchStart(element, { touches: [{ clientX: 100, clientY: 0 }] });
  fireEvent.touchEnd(element, {
    changedTouches: [{ clientX: 100 + distance, clientY: 0 }],
  });
}

describe('MealsDisplay — mobile swipe navigation', () => {
  it('swipe left advances to the next day', () => {
    const days = createAssembledDays(3);
    render(<MealsDisplay assembledDays={days} />);

    const firstActiveTab = getActiveTabs()[0];
    expect(firstActiveTab).toHaveAttribute(
      'data-testid',
      `mobile-day-tab-${days[0].dayId}`,
    );

    swipeLeft(getMobileDayView());

    const newActiveTab = getActiveTabs()[0];
    expect(newActiveTab).toHaveAttribute(
      'data-testid',
      `mobile-day-tab-${days[1].dayId}`,
    );
  });

  it('swipe right goes back to the previous day', () => {
    const days = createAssembledDays(3);
    render(<MealsDisplay assembledDays={days} />);

    // Go to day 2 first
    swipeLeft(getMobileDayView());
    expect(getActiveTabs()[0]).toHaveAttribute(
      'data-testid',
      `mobile-day-tab-${days[1].dayId}`,
    );

    // Swipe right to go back
    swipeRight(getMobileDayView());
    expect(getActiveTabs()[0]).toHaveAttribute(
      'data-testid',
      `mobile-day-tab-${days[0].dayId}`,
    );
  });

  it('swipe right does not go before the first day', () => {
    const days = createAssembledDays(3);
    render(<MealsDisplay assembledDays={days} />);

    swipeRight(getMobileDayView());

    expect(getActiveTabs()[0]).toHaveAttribute(
      'data-testid',
      `mobile-day-tab-${days[0].dayId}`,
    );
  });

  it('swipe left does not go past the last day', () => {
    const days = createAssembledDays(3);
    render(<MealsDisplay assembledDays={days} />);

    swipeLeft(getMobileDayView());
    swipeLeft(getMobileDayView());
    swipeLeft(getMobileDayView()); // one extra beyond the limit

    expect(getActiveTabs()[0]).toHaveAttribute(
      'data-testid',
      `mobile-day-tab-${days[2].dayId}`,
    );
  });

  it('ignores swipe smaller than the minimum distance', () => {
    const days = createAssembledDays(3);
    render(<MealsDisplay assembledDays={days} />);

    fireEvent.touchStart(getMobileDayView(), {
      touches: [{ clientX: 300, clientY: 0 }],
    });
    fireEvent.touchEnd(getMobileDayView(), {
      changedTouches: [{ clientX: 270, clientY: 0 }],
    });

    expect(getActiveTabs()[0]).toHaveAttribute(
      'data-testid',
      `mobile-day-tab-${days[0].dayId}`,
    );
  });
});

describe('MealsDisplay — mobile tab double-click selection', () => {
  it('double-clicking a tab selects the day', async () => {
    const days = createAssembledDays(3);
    render(<MealsDisplay assembledDays={days} />);

    const tab = screen.getByTestId(`mobile-day-tab-${days[0].dayId}`);
    await userEvent.dblClick(tab);

    // After double-click, the selection badge (✓) should appear on that tab
    expect(tab.querySelector('span[class*="selected"]')).toBeTruthy();
  });

  it('double-clicking the same tab again deselects the day', async () => {
    const days = createAssembledDays(3);
    render(<MealsDisplay assembledDays={days} />);

    const tab = screen.getByTestId(`mobile-day-tab-${days[0].dayId}`);
    await userEvent.dblClick(tab);
    await userEvent.dblClick(tab);

    expect(tab.querySelector('span[class*="selected"]')).toBeNull();
  });

  it('double-clicking different tabs selects multiple days', async () => {
    const days = createAssembledDays(3);
    render(<MealsDisplay assembledDays={days} />);

    const tab0 = screen.getByTestId(`mobile-day-tab-${days[0].dayId}`);
    const tab1 = screen.getByTestId(`mobile-day-tab-${days[1].dayId}`);

    await userEvent.dblClick(tab0);
    await userEvent.dblClick(tab1);

    expect(tab0.querySelector('span[class*="selected"]')).toBeTruthy();
    expect(tab1.querySelector('span[class*="selected"]')).toBeTruthy();
  });
});
