import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { mockDayApiFetch } from "../../../../../tests/mocks/dayApi";
import {
  createAndPersistMultipleTestDaysWithWeights,
  createAndPersistTest_Day_Recipes_Ingredients_User,
} from "../../../../../tests/mocks/days";
import { createAndPersistTestUser } from "../../../../../tests/mocks/user";
import { TestDaysRepo } from "../../../../../tests/repos/TestDaysRepo";
import { TestUsersRepo } from "../../../../../tests/repos/TestUsersRepo";
import { dateToDayId } from "../../../../domain/value-objects/DayId/DayId";
import MealsDisplay from "../MealsDisplay";

afterEach(() => {
  TestUsersRepo.clearForTesting();
  TestDaysRepo.clearForTesting();
  vi.restoreAllMocks();
});

async function setup() {
  const dayIds = await createAssembledDays(3);
  mockDayApiFetch();
  render(<MealsDisplay dayIds={dayIds} />);

  await screen.findByTestId(`mobile-day-tab-${dayIds[0]}`);

  return { dayIds };
}

describe("MealsDisplay", () => {
  it("should render day summaries in the desktop view", async () => {
    const { dayIds } = await setup();

    const daySummariesContainer = screen.getByTestId("desktop-days-grid");

    await waitFor(() => {
      expect(daySummariesContainer.children).toHaveLength(dayIds.length);
    });
  });

  describe("mobile swipe navigation", () => {
    it("swipe left advances to the next day", async () => {
      const { dayIds } = await setup();

      const firstActiveTab = getActiveTabs()[0];
      expect(firstActiveTab).toHaveAttribute(
        "data-testid",
        `mobile-day-tab-${dayIds[0]}`,
      );

      swipeLeft(getMobileDayView());

      const newActiveTab = getActiveTabs()[0];
      expect(newActiveTab).toHaveAttribute(
        "data-testid",
        `mobile-day-tab-${dayIds[1]}`,
      );
    });

    it("swipe right goes back to the previous day", async () => {
      const { dayIds } = await setup();

      // Go to day 2 first
      swipeLeft(getMobileDayView());
      expect(getActiveTabs()[0]).toHaveAttribute(
        "data-testid",
        `mobile-day-tab-${dayIds[1]}`,
      );

      // Swipe right to go back
      swipeRight(getMobileDayView());
      expect(getActiveTabs()[0]).toHaveAttribute(
        "data-testid",
        `mobile-day-tab-${dayIds[0]}`,
      );
    });

    it("swipe right does not go before the first day", async () => {
      const { dayIds } = await setup();

      swipeRight(getMobileDayView());

      expect(getActiveTabs()[0]).toHaveAttribute(
        "data-testid",
        `mobile-day-tab-${dayIds[0]}`,
      );
    });

    it("swipe left does not go past the last day", async () => {
      const { dayIds } = await setup();

      swipeLeft(getMobileDayView());
      swipeLeft(getMobileDayView());
      swipeLeft(getMobileDayView()); // one extra beyond the limit

      expect(getActiveTabs()[0]).toHaveAttribute(
        "data-testid",
        `mobile-day-tab-${dayIds[2]}`,
      );
    });

    it("ignores swipe smaller than the minimum distance", async () => {
      const { dayIds } = await setup();

      fireEvent.touchStart(getMobileDayView(), {
        touches: [{ clientX: 300, clientY: 0 }],
      });
      fireEvent.touchEnd(getMobileDayView(), {
        changedTouches: [{ clientX: 270, clientY: 0 }],
      });

      expect(getActiveTabs()[0]).toHaveAttribute(
        "data-testid",
        `mobile-day-tab-${dayIds[0]}`,
      );
    });
  });

  describe("mobile initial day selection", () => {
    it("should start on today's day when today is in the list", async () => {
      const todayId = dateToDayId(new Date()).value;

      const today = dateToDayId(new Date());

      const day1 = await createAndPersistTest_Day_Recipes_Ingredients_User(
        1,
        1,
        2000,
      );
      const dayToday = await createAndPersistTest_Day_Recipes_Ingredients_User(
        today.day,
        today.month,
        today.year,
      );
      const day3 = await createAndPersistTest_Day_Recipes_Ingredients_User(
        3,
        1,
        2000,
      );

      mockDayApiFetch();
      render(<MealsDisplay dayIds={[day1.id, dayToday.id, day3.id]} />);

      await screen.findByTestId(`mobile-day-tab-${todayId}`);

      expect(getActiveTabs()[0]).toHaveAttribute(
        "data-testid",
        `mobile-day-tab-${todayId}`,
      );
    });

    it("should start on the first day when today is not in the list", async () => {
      const { dayIds } = await setup();

      expect(getActiveTabs()[0]).toHaveAttribute(
        "data-testid",
        `mobile-day-tab-${dayIds[0]}`,
      );
    });
  });

  describe("mobile tab double-click selection", () => {
    it("double-clicking a tab selects the day", async () => {
      const { dayIds } = await setup();

      const tab = await screen.findByTestId(`mobile-day-tab-${dayIds[0]}`);
      await userEvent.dblClick(tab);

      // After double-click, the selection badge (✓) should appear on that tab
      expect(tab.querySelector('span[class*="selected"]')).toBeTruthy();
    });

    it("double-clicking the same tab again deselects the day", async () => {
      const { dayIds } = await setup();

      const tab = await screen.findByTestId(`mobile-day-tab-${dayIds[0]}`);
      await userEvent.dblClick(tab);
      await userEvent.dblClick(tab);

      expect(tab.querySelector('span[class*="selected"]')).toBeNull();
    });

    it("double-clicking different tabs selects multiple days", async () => {
      const { dayIds } = await setup();

      const tab0 = await screen.findByTestId(`mobile-day-tab-${dayIds[0]}`);
      const tab1 = await screen.findByTestId(`mobile-day-tab-${dayIds[1]}`);

      await userEvent.dblClick(tab0);
      await userEvent.dblClick(tab1);

      expect(tab0.querySelector('span[class*="selected"]')).toBeTruthy();
      expect(tab1.querySelector('span[class*="selected"]')).toBeTruthy();
    });
  });

  it("renders empty day cards for dayIds with no assembled data", async () => {
    const today = dateToDayId(new Date()).value;
    const dayIds = ["20000101", today, "20000103"];

    await createAndPersistTestUser();

    mockDayApiFetch();
    render(<MealsDisplay dayIds={dayIds} />);

    const desktopGrid = await screen.findByTestId("desktop-days-grid");

    await waitFor(() => {
      expect(desktopGrid.children).toHaveLength(dayIds.length);
    });

    expect(
      await screen.findByTestId(`mobile-day-tab-${dayIds[0]}`),
    ).toBeInTheDocument();
  });
});

async function createAssembledDays(count: number): Promise<string[]> {
  const mockDays = await createAndPersistMultipleTestDaysWithWeights(count);

  return mockDays.map((day) => day.id);
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
