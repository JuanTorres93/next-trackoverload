import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AssembledDayResult } from "@/app/_features/day/actions";
import { dateToDayId } from "@/domain/value-objects/DayId/DayId";
import { MemoryDaysRepo } from "@/infra/repos/memory/MemoryDaysRepo";
import { MemoryUsersRepo } from "@/infra/repos/memory/MemoryUsersRepo";
import { AppDaysRepo } from "@/interface-adapters/app/repos/AppDaysRepo";
import { AppUsersRepo } from "@/interface-adapters/app/repos/AppUsersRepo";

import { createMultipleMockDaysWithWeights } from "../../../../../tests/mocks/days";
import MealsDisplay from "../MealsDisplay";

const usersRepo = AppUsersRepo as MemoryUsersRepo;
const daysRepo = AppDaysRepo as MemoryDaysRepo;

afterEach(() => {
  usersRepo.clearForTesting();
  daysRepo.clearForTesting();
});

async function setup() {
  const days = await createAssembledDays(3);
  render(<MealsDisplay assembledDays={days} />);

  return { days };
}

describe("MealsDisplay", () => {
  it("should render day summaries in the desktop view", async () => {
    const { days } = await setup();

    const daySummariesContainer = screen.getByTestId("desktop-days-grid");

    const children = daySummariesContainer.children;

    expect(children).toHaveLength(days.length);
  });

  describe("mobile swipe navigation", () => {
    it("swipe left advances to the next day", async () => {
      const { days } = await setup();

      const firstActiveTab = getActiveTabs()[0];
      expect(firstActiveTab).toHaveAttribute(
        "data-testid",
        `mobile-day-tab-${days[0].dayId}`,
      );

      swipeLeft(getMobileDayView());

      const newActiveTab = getActiveTabs()[0];
      expect(newActiveTab).toHaveAttribute(
        "data-testid",
        `mobile-day-tab-${days[1].dayId}`,
      );
    });

    it("swipe right goes back to the previous day", async () => {
      const { days } = await setup();

      // Go to day 2 first
      swipeLeft(getMobileDayView());
      expect(getActiveTabs()[0]).toHaveAttribute(
        "data-testid",
        `mobile-day-tab-${days[1].dayId}`,
      );

      // Swipe right to go back
      swipeRight(getMobileDayView());
      expect(getActiveTabs()[0]).toHaveAttribute(
        "data-testid",
        `mobile-day-tab-${days[0].dayId}`,
      );
    });

    it("swipe right does not go before the first day", async () => {
      const { days } = await setup();

      swipeRight(getMobileDayView());

      expect(getActiveTabs()[0]).toHaveAttribute(
        "data-testid",
        `mobile-day-tab-${days[0].dayId}`,
      );
    });

    it("swipe left does not go past the last day", async () => {
      const { days } = await setup();

      swipeLeft(getMobileDayView());
      swipeLeft(getMobileDayView());
      swipeLeft(getMobileDayView()); // one extra beyond the limit

      expect(getActiveTabs()[0]).toHaveAttribute(
        "data-testid",
        `mobile-day-tab-${days[2].dayId}`,
      );
    });

    it("ignores swipe smaller than the minimum distance", async () => {
      const { days } = await setup();

      fireEvent.touchStart(getMobileDayView(), {
        touches: [{ clientX: 300, clientY: 0 }],
      });
      fireEvent.touchEnd(getMobileDayView(), {
        changedTouches: [{ clientX: 270, clientY: 0 }],
      });

      expect(getActiveTabs()[0]).toHaveAttribute(
        "data-testid",
        `mobile-day-tab-${days[0].dayId}`,
      );
    });
  });

  describe("mobile initial day selection", () => {
    it("should start on today's day when today is in the list", () => {
      const todayId = dateToDayId(new Date()).value;

      const days: AssembledDayResult[] = [
        { dayId: "20000101", assembledDay: null },
        { dayId: todayId, assembledDay: null },
        { dayId: "20000103", assembledDay: null },
      ];
      render(<MealsDisplay assembledDays={days} />);

      expect(getActiveTabs()[0]).toHaveAttribute(
        "data-testid",
        `mobile-day-tab-${todayId}`,
      );
    });

    it("should start on the first day when today is not in the list", async () => {
      const { days } = await setup();

      expect(getActiveTabs()[0]).toHaveAttribute(
        "data-testid",
        `mobile-day-tab-${days[0].dayId}`,
      );
    });
  });

  describe("mobile tab double-click selection", () => {
    it("double-clicking a tab selects the day", async () => {
      const { days } = await setup();

      const tab = screen.getByTestId(`mobile-day-tab-${days[0].dayId}`);
      await userEvent.dblClick(tab);

      // After double-click, the selection badge (✓) should appear on that tab
      expect(tab.querySelector('span[class*="selected"]')).toBeTruthy();
    });

    it("double-clicking the same tab again deselects the day", async () => {
      const { days } = await setup();

      const tab = screen.getByTestId(`mobile-day-tab-${days[0].dayId}`);
      await userEvent.dblClick(tab);
      await userEvent.dblClick(tab);

      expect(tab.querySelector('span[class*="selected"]')).toBeNull();
    });

    it("double-clicking different tabs selects multiple days", async () => {
      const { days } = await setup();

      const tab0 = screen.getByTestId(`mobile-day-tab-${days[0].dayId}`);
      const tab1 = screen.getByTestId(`mobile-day-tab-${days[1].dayId}`);

      await userEvent.dblClick(tab0);
      await userEvent.dblClick(tab1);

      expect(tab0.querySelector('span[class*="selected"]')).toBeTruthy();
      expect(tab1.querySelector('span[class*="selected"]')).toBeTruthy();
    });
  });
});

async function createAssembledDays(
  count: number,
): Promise<AssembledDayResult[]> {
  const mockDays = await createMultipleMockDaysWithWeights(count);

  return mockDays.map((day) => ({
    dayId: day.id,
    assembledDay: null, // For testing navigation, the actual content is not needed
  }));
}

function getActiveTabs() {
  return screen
    .getAllByRole("button")
    .filter((btn) => btn.getAttribute("aria-current") === "date");
}

function getMobileDayView() {
  return screen.getByTestId("mobile-day-view");
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
