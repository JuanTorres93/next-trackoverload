import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { createMockDay } from "../../../../../tests/mocks/days";
import { TEST_USER_ID } from "../../../../../tests/mocks/nextjs";
import { TestDaysRepo } from "../../../../../tests/repos/TestDaysRepo";
import { TestFakeMealsRepo } from "../../../../../tests/repos/TestFakeMealsRepo";
import { TestMealsRepo } from "../../../../../tests/repos/TestMealsRepo";
import { TestRecipesRepo } from "../../../../../tests/repos/TestRecipesRepo";
import MealReminder from "../MealReminder";

async function setup() {
  const dayWithMeal = await createMockDay(1, 1, 2000, {
    createWithMeal: true,
    returnAssembled: true,
  });
  const meal = dayWithMeal.meals[0];

  render(<MealReminder meal={meal} dayId={dayWithMeal.id} />);

  const card = screen.getByText(meal.name).closest("div") as HTMLDivElement;

  return { meal, dayId: dayWithMeal.id, card };
}

describe("MealReminder", () => {
  afterEach(() => {
    TestMealsRepo.clearForTesting();
    TestDaysRepo.clearForTesting();
    TestFakeMealsRepo.clearForTesting();
    TestRecipesRepo.clearForTesting();
  });

  it("should toggle isEaten to true when clicking an uneaten meal", async () => {
    const { meal, card } = await setup();

    await userEvent.click(card);

    await waitFor(async () => {
      const saved = await TestMealsRepo.getMealByIdForUser(
        meal.id,
        TEST_USER_ID,
      );
      expect(saved?.isEaten).toBe(true);
    });
  });

  it("should toggle isEaten back to false when clicking an already eaten meal", async () => {
    const { meal, card } = await setup();

    await userEvent.click(card);

    await waitFor(async () => {
      const saved = await TestMealsRepo.getMealByIdForUser(
        meal.id,
        TEST_USER_ID,
      );
      expect(saved?.isEaten).toBe(true);
    });

    await userEvent.click(card);

    await waitFor(async () => {
      const saved = await TestMealsRepo.getMealByIdForUser(
        meal.id,
        TEST_USER_ID,
      );
      expect(saved?.isEaten).toBe(false);
    });
  });

  it("should delete meal on click delete button", async () => {
    const { meal } = await setup();

    const deleteButton = screen.getByTestId("delete-food-button");
    await userEvent.click(deleteButton);

    await waitFor(async () => {
      const saved = await TestMealsRepo.getMealByIdForUser(
        meal.id,
        TEST_USER_ID,
      );

      expect(saved).toBeNull();
    });
  });
});
