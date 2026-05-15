import { loginInAPITests } from "@/app/api/__tests__/loginInAPITests";
import { logoutInAPITests } from "@/app/api/__tests__/logoutInAPITests";
import { registerUserInAPITests } from "@/app/api/__tests__/registerUserInAPITests";
import { Recipe } from "@/domain/entities/recipe/Recipe";
import { User } from "@/domain/entities/user/User";
import { MemoryRecipesRepo } from "@/infra/repos/memory/MemoryRecipesRepo";
import { MemoryUsersRepo } from "@/infra/repos/memory/MemoryUsersRepo";
import { AppRecipesRepo } from "@/interface-adapters/app/repos/AppRecipesRepo";
import { AppUsersRepo } from "@/interface-adapters/app/repos/AppUsersRepo";

import * as recipeTestProps from "../../../../../../../../tests/createProps/recipeTestProps";
import * as userTestProps from "../../../../../../../../tests/createProps/userTestProps";
import { DELETE } from "../route";

describe("DELETE /api/recipe/[recipeId]/ingredient/[ingredientId]", () => {
  let recipesRepo: MemoryRecipesRepo;
  let usersRepo: MemoryUsersRepo;

  let user1: User;
  let user1Id: string;
  let testRecipe: Recipe;

  beforeEach(async () => {
    recipesRepo = AppRecipesRepo as MemoryRecipesRepo;
    usersRepo = AppUsersRepo as MemoryUsersRepo;

    recipesRepo.clearForTesting();
    usersRepo.clearForTesting();

    user1 = userTestProps.createTestUser();
    await registerUserInAPITests(user1.email, user1.name);
    user1Id = (await usersRepo.getUserByEmail(user1.email))!.id;

    testRecipe = recipeTestProps.createTestRecipe({ userId: user1Id }, 2);
    await recipesRepo.saveRecipe(testRecipe);

    await logoutInAPITests();
  });

  const getIngredientId = (recipe: Recipe): string =>
    recipe.ingredientLines[0].ingredient.id;

  it("returns JSEND format if user is not logged in", async () => {
    const ingredientId = getIngredientId(testRecipe);

    const response = await DELETE(
      new Request(
        `http://localhost/api/recipe/${testRecipe.id}/ingredient/${ingredientId}`,
        { method: "DELETE" },
      ),
      {
        params: Promise.resolve({
          recipeId: testRecipe.id,
          ingredientId,
        }),
      },
    );

    const data = await response.json();

    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("data");
  });

  it("should return JSEND format if user is logged in", async () => {
    await loginInAPITests(user1.email);

    const ingredientId = getIngredientId(testRecipe);

    const response = await DELETE(
      new Request(
        `http://localhost/api/recipe/${testRecipe.id}/ingredient/${ingredientId}`,
        { method: "DELETE" },
      ),
      {
        params: Promise.resolve({
          recipeId: testRecipe.id,
          ingredientId,
        }),
      },
    );

    const data = await response.json();

    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("data");
  });

  it("should remove the ingredient from the recipe", async () => {
    await loginInAPITests(user1.email);

    const ingredientId = getIngredientId(testRecipe);
    const initialCount = testRecipe.ingredientLines.length;

    const response = await DELETE(
      new Request(
        `http://localhost/api/recipe/${testRecipe.id}/ingredient/${ingredientId}`,
        { method: "DELETE" },
      ),
      {
        params: Promise.resolve({
          recipeId: testRecipe.id,
          ingredientId,
        }),
      },
    );

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toHaveProperty("id", testRecipe.id);
    expect(data.data.ingredientLines.length).toBe(initialCount - 1);
  });

  describe("Errors", () => {
    it("should return 401 if user is not logged in", async () => {
      const ingredientId = getIngredientId(testRecipe);

      const response = await DELETE(
        new Request(
          `http://localhost/api/recipe/${testRecipe.id}/ingredient/${ingredientId}`,
          { method: "DELETE" },
        ),
        {
          params: Promise.resolve({
            recipeId: testRecipe.id,
            ingredientId,
          }),
        },
      );

      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toHaveProperty("status", "fail");
      expect(data.data).toHaveProperty("message");
    });

    it("should return 404 if recipe does not exist", async () => {
      await loginInAPITests(user1.email);

      const response = await DELETE(
        new Request(
          "http://localhost/api/recipe/non-existent-recipe/ingredient/ing1",
          { method: "DELETE" },
        ),
        {
          params: Promise.resolve({
            recipeId: "non-existent-recipe",
            ingredientId: "ing1",
          }),
        },
      );

      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("status", "fail");
      expect(data.data).toHaveProperty("message");
    });
  });
});
