import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { createAndPersistTestRecipes } from "../../../../../../tests/mocks/recipes";
import { TestRecipesRepo } from "../../../../../../tests/repos/TestRecipesRepo";
import { TestUsersRepo } from "../../../../../../tests/repos/TestUsersRepo";
import { RecipeDTO } from "../../../../../application-layer/dtos/RecipeDTO";
import UpdateRecipeTitle from "../UpdateRecipeTitle";

let recipe: RecipeDTO;

async function setup() {
  const { mockRecipes } = await createAndPersistTestRecipes();
  recipe = mockRecipes[0];

  render(
    <UpdateRecipeTitle originalTitle={recipe.name} recipeId={recipe.id} />,
  );

  return { recipe };
}

afterEach(() => {
  TestRecipesRepo.clearForTesting();
  TestUsersRepo.clearForTesting();
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
      const updatedRecipe = await TestRecipesRepo.getRecipeById(recipe.id);

      expect(updatedRecipe).not.toBeNull();
      expect(updatedRecipe!.name).toBe(newTitle);
    });
  });
});
