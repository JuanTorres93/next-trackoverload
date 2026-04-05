import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { createMockRecipes } from "@/../tests/mocks/recipes";
import { RecipeDTO } from "@/application-layer/dtos/RecipeDTO";
import { MemoryRecipesRepo } from "@/infra/repos/memory/MemoryRecipesRepo";
import { MemoryUsersRepo } from "@/infra/repos/memory/MemoryUsersRepo";
import { AppRecipesRepo } from "@/interface-adapters/app/repos/AppRecipesRepo";
import { AppUsersRepo } from "@/interface-adapters/app/repos/AppUsersRepo";

import UpdateRecipeTitle from "../UpdateRecipeTitle";

const recipesRepo = AppRecipesRepo as MemoryRecipesRepo;
const usersRepo = AppUsersRepo as MemoryUsersRepo;
let recipe: RecipeDTO;

async function setup() {
  const { mockRecipes } = await createMockRecipes();
  recipe = mockRecipes[0];

  render(
    <UpdateRecipeTitle originalTitle={recipe.name} recipeId={recipe.id} />,
  );

  return { recipe };
}

afterEach(() => {
  recipesRepo.clearForTesting();
  usersRepo.clearForTesting();
});

describe("UpdateRecipeTitle", () => {
  it("updates recipe name", async () => {
    await setup();

    const titleInput = (await screen.findByDisplayValue(
      recipe.name,
    )) as HTMLInputElement;

    const newTitle = "Updated Recipe Title";

    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, newTitle);

    await waitFor(async () => {
      const updatedRecipe = await recipesRepo.getRecipeById(recipe.id);

      expect(updatedRecipe).not.toBeNull();
      expect(updatedRecipe!.name).toBe(newTitle);
    });
  });
});
