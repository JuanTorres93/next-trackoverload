import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { endOfWeek, format, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";

import {
  mockRouterReplace,
  resetMockSearchParams,
} from "@/../tests/mocks/nextjs";

import WeekSelector, { formatDateToFilterValue } from "../WeekSelector";

async function setup() {
  render(<WeekSelector />);

  const prevWeekButton = screen.getByTestId("prev-week-button");
  const nextWeekButton = screen.getByTestId("next-week-button");

  const weekRangeDisplay = screen.getByTestId("week-range-display");

  return { prevWeekButton, nextWeekButton, weekRangeDisplay };
}

describe("WeekSelector", () => {
  beforeEach(() => {
    mockRouterReplace.mockClear();
    resetMockSearchParams();
  });

  it("should navigate to next week when clicking button", async () => {
    const { nextWeekButton } = await setup();

    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const nextWeekFilter = formatDateToFilterValue(nextWeek);

    await userEvent.click(nextWeekButton);

    await waitFor(() => {
      expect(mockRouterReplace).toHaveBeenCalledWith(
        expect.stringContaining(`week=${nextWeekFilter}`),
        expect.anything(),
      );
    });
  });

  it("should navigate to previous week when clicking button", async () => {
    const { prevWeekButton } = await setup();

    const today = new Date();
    const prevWeek = new Date(today);
    prevWeek.setDate(today.getDate() - 7);

    const prevWeekFilter = formatDateToFilterValue(prevWeek);

    await userEvent.click(prevWeekButton);

    await waitFor(() => {
      expect(mockRouterReplace).toHaveBeenCalledWith(
        expect.stringContaining(`week=${prevWeekFilter}`),
        expect.anything(),
      );
    });
  });

  it("should show current week", async () => {
    const { weekRangeDisplay } = await setup();

    const today = new Date();

    const weekStartsOnMonday = 1;
    const weekStart = startOfWeek(today, {
      weekStartsOn: weekStartsOnMonday,
    });
    const weekEnd = endOfWeek(today, {
      weekStartsOn: weekStartsOnMonday,
    });

    const expectedWeekRange = `${format(weekStart, "d 'de' MMMM", { locale: es })} — ${format(weekEnd, "d 'de' MMMM", { locale: es })}`;

    expect(weekRangeDisplay).toHaveTextContent(expectedWeekRange);
  });

  it("should not show today button if is current week", async () => {
    await setup();

    expect(
      screen.queryByRole("button", { name: /hoy/i }),
    ).not.toBeInTheDocument();
  });

  it("should show today button if is not current week", async () => {
    const { nextWeekButton } = await setup();

    await userEvent.click(nextWeekButton);

    await waitFor(async () => {
      const todayButton = await screen.findByText(/hoy/i);

      expect(todayButton).toBeInTheDocument();
    });
  });
});
