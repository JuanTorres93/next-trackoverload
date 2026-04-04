import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MemoryDaysRepo } from "@/infra/repos/memory/MemoryDaysRepo";
import { MemoryMealsRepo } from "@/infra/repos/memory/MemoryMealsRepo";
import { AppDaysRepo } from "@/interface-adapters/app/repos/AppDaysRepo";
import { AppMealsRepo } from "@/interface-adapters/app/repos/AppMealsRepo";

import { createMockDay } from "../../../../../tests/mocks/days";
import MealLine from "../MealLine";

const daysRepo = AppDaysRepo as MemoryDaysRepo;
const mealsRepo = AppMealsRepo as MemoryMealsRepo;

const DELETE_BUTTON_TEST_ID = "nutritional-summary-delete-button";

async function setup() {
  const day = await createMockDay(1, 1, 2000, {
    createWithMeal: true,
    returnAssembled: true,
  });
  const meal = day.meals[0];

  render(<MealLine meal={meal} dayId={day.id} />);

  const deleteButton = screen.getByTestId(DELETE_BUTTON_TEST_ID);

  return { deleteButton, meal, day };
}

describe("MealLine", () => {
  afterEach(() => {
    daysRepo.clearForTesting();
    mealsRepo.clearForTesting();
  });

  it("should render meal name", async () => {
    const { meal } = await setup();

    const mealName = await screen.findByText(meal.name);

    expect(mealName).toBeInTheDocument();
  });

  it("should render meal calories", async () => {
    const { meal } = await setup();

    const caloriesElement = screen.getByText(
      new RegExp(meal.calories.toString(), "i"),
    );

    expect(caloriesElement).toBeInTheDocument();
  });

  it("should render meal protein", async () => {
    const { meal } = await setup();

    const roundedProtein = Math.round(meal.protein);

    const proteinElement = screen.getByText(
      new RegExp(roundedProtein.toString(), "i"),
    );

    expect(proteinElement).toBeInTheDocument();
  });

  it("should remove meal from day on delete button click", async () => {
    const { deleteButton, day } = await setup();

    const dayInRepo = await daysRepo.getDayById(day.id);

    expect(dayInRepo!.mealIds).toHaveLength(1);

    userEvent.click(deleteButton);

    await waitFor(async () => {
      const dayInRepoAfter = await daysRepo.getDayById(day.id);

      expect(dayInRepoAfter!.mealIds).toHaveLength(0);
    });
  });

  it("should remove meal from repo on delete button click", async () => {
    const { deleteButton, meal } = await setup();

    const mealInRepo = await mealsRepo.getMealById(meal.id);

    expect(mealInRepo).not.toBeNull();

    act(() => {
      deleteButton.click();
    });

    await waitFor(async () => {
      const mealInRepoAfter = await mealsRepo.getMealById(meal.id);

      expect(mealInRepoAfter).toBeNull();
    });
  });

  it("should not render delete button if dayId is not provided", async () => {
    const day = await createMockDay(1, 1, 2000, {
      createWithMeal: true,
      returnAssembled: true,
    });

    const meal = day.meals[0];

    render(<MealLine meal={meal} />);

    const deleteButton = screen.queryByTestId(DELETE_BUTTON_TEST_ID);

    expect(deleteButton).toBeNull();
  });
});
