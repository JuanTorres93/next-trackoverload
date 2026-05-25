import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { createMockDay } from "../../../../../tests/mocks/days";
import { TEST_USER_ID } from "../../../../../tests/mocks/nextjs";
import { createMockRecipes } from "../../../../../tests/mocks/recipes";
import { createServer } from "../../../../../tests/mocks/server";
import { RecipeDTO } from "../../../../application-layer/dtos/RecipeDTO";
import { MemoryDaysRepo } from "../../../../infra/repos/memory/MemoryDaysRepo";
import { MemoryFakeMealsRepo } from "../../../../infra/repos/memory/MemoryFakeMealsRepo";
import { MemoryMealsRepo } from "../../../../infra/repos/memory/MemoryMealsRepo";
import { MemoryRecipesRepo } from "../../../../infra/repos/memory/MemoryRecipesRepo";
import { AppDaysRepo } from "../../../../interface-adapters/app/repos/AppDaysRepo";
import { AppFakeMealsRepo } from "../../../../interface-adapters/app/repos/AppFakeMealsRepo";
import { AppMealsRepo } from "../../../../interface-adapters/app/repos/AppMealsRepo";
import { AppRecipesRepo } from "../../../../interface-adapters/app/repos/AppRecipesRepo";
import MealReminder from "../MealReminder";

const mealsRepo = AppMealsRepo as MemoryMealsRepo;
const daysRepo = AppDaysRepo as MemoryDaysRepo;
const fakeMealsRepo = AppFakeMealsRepo as MemoryFakeMealsRepo;
const recipesRepo = AppRecipesRepo as MemoryRecipesRepo;

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
    mealsRepo.clearForTesting();
    daysRepo.clearForTesting();
    fakeMealsRepo.clearForTesting();
    recipesRepo.clearForTesting();
  });

  it("should toggle isEaten to true when clicking an uneaten meal", async () => {
    const { meal, card } = await setup();

    await userEvent.click(card);

    await waitFor(async () => {
      const saved = await mealsRepo.getMealByIdForUser(meal.id, TEST_USER_ID);
      expect(saved?.isEaten).toBe(true);
    });
  });

  it("should toggle isEaten back to false when clicking an already eaten meal", async () => {
    const { meal, card } = await setup();

    await userEvent.click(card);

    await waitFor(async () => {
      const saved = await mealsRepo.getMealByIdForUser(meal.id, TEST_USER_ID);
      expect(saved?.isEaten).toBe(true);
    });

    await userEvent.click(card);

    await waitFor(async () => {
      const saved = await mealsRepo.getMealByIdForUser(meal.id, TEST_USER_ID);
      expect(saved?.isEaten).toBe(false);
    });
  });
});
