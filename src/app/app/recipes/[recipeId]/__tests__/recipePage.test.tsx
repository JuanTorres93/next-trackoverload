import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { createMockRecipes } from "@/../tests/mocks/recipes";
import { RecipeDTO } from "@/application-layer/dtos/RecipeDTO";
import { MemoryRecipesRepo } from "@/infra/repos/memory/MemoryRecipesRepo";
import { MemoryUsersRepo } from "@/infra/repos/memory/MemoryUsersRepo";
import { AppRecipesRepo } from "@/interface-adapters/app/repos/AppRecipesRepo";
import { AppUsersRepo } from "@/interface-adapters/app/repos/AppUsersRepo";

import RecipePage from "../page";

const recipesRepo = AppRecipesRepo as MemoryRecipesRepo;
const usersRepo = AppUsersRepo as MemoryUsersRepo;
let mockRecipes: RecipeDTO[] = [];

async function setup() {
  // Recreate mock recipes for each test to ensure a clean state
  const { mockRecipes: recipes } = await createMockRecipes();
  mockRecipes = recipes;

  const renderedRecipe = recipes[0];

  const ui = await RecipePage({
    // IMPORTANT DOC: params is a Promise due to Next.js implementation
    params: Promise.resolve({ recipeId: renderedRecipe.id }),
  });
  render(ui);

  return { renderedRecipe };
}

afterEach(() => {
  recipesRepo.clearForTesting();
  usersRepo.clearForTesting();
});

describe("RecipePage", () => {
  describe("Shown info", () => {
    it("renders recipe title (UpdateRecipeTitle)", async () => {
      await setup();

      const title = await screen.findByDisplayValue(mockRecipes[0].name);

      expect(title).toBeInTheDocument();
    });

    it("renders rounded calories", async () => {
      await setup();

      const calories = mockRecipes[0].calories;
      const roundedCalories = Math.round(calories).toString();

      const caloriesElement = screen.getByText(roundedCalories);

      expect(calories).toBeDefined();
      expect(calories).toBeGreaterThan(0);
      expect(caloriesElement).toBeInTheDocument();
    });

    it("renders rounded protein", async () => {
      await setup();

      const protein = mockRecipes[0].protein;
      const roundedProtein = Math.round(protein).toString();

      const proteinElement = screen.getByText(new RegExp(`${roundedProtein}`));

      expect(protein).toBeDefined();
      expect(protein).toBeGreaterThan(0);
      expect(proteinElement).toBeInTheDocument();
    });

    it("renders ingredient lines (RecipeActions)", async () => {
      await setup();

      for (const line of mockRecipes[0].ingredientLines) {
        expect(screen.getByText(line.ingredient.name)).toBeInTheDocument();
      }
    });

    it("renders change image button (UpdateRecipeImage)", async () => {
      await setup();

      const updateImageButton = screen.getByTestId("edit-recipe-image-button");

      expect(updateImageButton).toBeInTheDocument();
    });
  });

  describe("Behavior", () => {
    it("renders duplicate button (DuplicateRecipe)", async () => {
      await setup();

      const duplicateButton = screen.getByTestId("duplicate-recipe-button");

      expect(duplicateButton).toBeInTheDocument();
    });

    it("renders delete button (DeleteRecipe)", async () => {
      await setup();

      const deleteButton = screen.getByTestId("delete-recipe-button");

      expect(deleteButton).toBeInTheDocument();
    });
  });
});
