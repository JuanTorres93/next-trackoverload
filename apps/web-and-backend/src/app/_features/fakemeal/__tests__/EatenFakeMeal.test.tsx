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
import { AppDaysRepo } from "../../../../interface-adapters/app/repos/AppDaysRepo";
import { AppFakeMealsRepo } from "../../../../interface-adapters/app/repos/AppFakeMealsRepo";
import { AppMealsRepo } from "../../../../interface-adapters/app/repos/AppMealsRepo";
import EatenFakeMeal from "../EatenFakeMeal";

const daysRepo = AppDaysRepo as MemoryDaysRepo;
const fakeMealsRepo = AppFakeMealsRepo as MemoryFakeMealsRepo;
const mealsRepo = AppMealsRepo as MemoryMealsRepo;

async function setup() {
  const dayWithFakeMeal = await createMockDay(1, 1, 2000, {
    returnAssembled: true,
    fakeMeals: { name: "Test Fake Meal", calories: 400, protein: 25 },
  });
  const fakeMeal = dayWithFakeMeal.fakeMeals[0];

  render(<EatenFakeMeal fakeMeal={fakeMeal} dayId={dayWithFakeMeal.id} />);

  return { fakeMeal, dayId: dayWithFakeMeal.id };
}

describe("EatenFakeMeal", () => {
  afterEach(() => {
    daysRepo.clearForTesting();
    fakeMealsRepo.clearForTesting();
    mealsRepo.clearForTesting();
  });

  it("should delete fake meal when clicking delete button", async () => {
    const { fakeMeal } = await setup();

    const deleteButton = screen.getByTestId("delete-food-button");

    await userEvent.click(deleteButton);

    await waitFor(async () => {
      const savedFakeMeal = await fakeMealsRepo.getFakeMealByIdAndUserId(
        fakeMeal.id,
        TEST_USER_ID,
      );

      expect(savedFakeMeal).toBeNull();
    });
  });
});
