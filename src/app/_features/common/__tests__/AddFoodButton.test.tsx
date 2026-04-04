import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TEST_USER_ID } from "@/../tests/mocks/nextjs";
import { RecipeDTO } from "@/application-layer/dtos/RecipeDTO";
import { MemoryDaysRepo } from "@/infra/repos/memory/MemoryDaysRepo";
import { MemoryFakeMealsRepo } from "@/infra/repos/memory/MemoryFakeMealsRepo";
import { MemoryMealsRepo } from "@/infra/repos/memory/MemoryMealsRepo";
import { AppDaysRepo } from "@/interface-adapters/app/repos/AppDaysRepo";
import { AppFakeMealsRepo } from "@/interface-adapters/app/repos/AppFakeMealsRepo";
import { AppMealsRepo } from "@/interface-adapters/app/repos/AppMealsRepo";

import { createMockDay } from "../../../../../tests/mocks/days";
import { createMockRecipes } from "../../../../../tests/mocks/recipes";
import { createServer } from "../../../../../tests/mocks/server";
import AddFoodButton from "../AddFoodButton";

const daysRepo = AppDaysRepo as MemoryDaysRepo;
const mealsRepo = AppMealsRepo as MemoryMealsRepo;
const fakeMealsRepo = AppFakeMealsRepo as MemoryFakeMealsRepo;

describe("AddFoodButton", () => {
  let mockRecipesForApi: RecipeDTO[] = [];

  createServer([
    {
      path: "/api/recipe/getAll",
      method: "get",
      response: () => ({ status: "success", data: mockRecipesForApi }),
    },
  ]);

  afterEach(() => {
    daysRepo.clearForTesting();
    mealsRepo.clearForTesting();
    fakeMealsRepo.clearForTesting();
    mockRecipesForApi = [];
  });

  it("renders an add food button", async () => {
    const day = await createMockDay();
    render(<AddFoodButton dayId={day.id} />);

    expect(screen.getByTestId("add-food-button")).toBeInTheDocument();
  });

  it("shows food type selection modal when the add food button is clicked", async () => {
    const day = await createMockDay();
    render(<AddFoodButton dayId={day.id} />);

    await userEvent.click(screen.getByTestId("add-food-button"));

    expect(
      screen.getByText(/elige una opción para añadir/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^comida/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /entrada rápida/i }),
    ).toBeInTheDocument();
  });

  it("adds a meal from a recipe to the day", async () => {
    const day = await createMockDay(1, 1, 2000, {
      createWithMeal: true,
      returnAssembled: true,
    });
    const originalMealCount = day.meals.length;
    const { mockRecipes } = await createMockRecipes();
    mockRecipesForApi = mockRecipes;

    render(<AddFoodButton dayId={day.id} />);

    await userEvent.click(screen.getByTestId("add-food-button"));
    await userEvent.click(screen.getByRole("button", { name: /^comida/i }));

    await userEvent.click(
      await screen.findByRole("heading", { name: mockRecipes[0].name }),
    );
    await userEvent.click(
      screen.getByRole("button", { name: /añadir comidas/i }),
    );

    await waitFor(async () => {
      const updatedDay = await daysRepo.getDayByIdAndUserId(
        day.id,
        TEST_USER_ID,
      );
      expect(updatedDay?.mealIds.length).toBeGreaterThan(originalMealCount);
    });
  });

  it("adds a fake meal to the day", async () => {
    const day = await createMockDay(1, 1, 2000, {
      createWithMeal: true,
      returnAssembled: true,
    });
    const originalFakeMealCount = day.fakeMeals.length;

    render(<AddFoodButton dayId={day.id} />);

    await userEvent.click(screen.getByTestId("add-food-button"));
    await userEvent.click(
      screen.getByRole("button", { name: /entrada rápida/i }),
    );

    await userEvent.type(
      screen.getByLabelText(/nombre de la comida/i),
      "New Fake Meal",
    );
    await userEvent.type(screen.getByLabelText(/calorías/i), "500");
    await userEvent.type(screen.getByLabelText(/proteínas/i), "30");

    const form = document.querySelector("form")!;
    await userEvent.click(
      within(form).getByRole("button", { name: /añadir comida/i }),
    );

    await waitFor(async () => {
      const updatedDay = await daysRepo.getDayByIdAndUserId(
        day.id,
        TEST_USER_ID,
      );
      expect(updatedDay?.fakeMealIds.length).toBeGreaterThan(
        originalFakeMealCount,
      );
    });
  });
});
