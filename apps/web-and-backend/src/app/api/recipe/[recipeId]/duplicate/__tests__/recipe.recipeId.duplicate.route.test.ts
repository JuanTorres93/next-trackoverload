import type { NextRequest } from "next/server";

import * as recipeTestProps from "../../../../../../../tests/createProps/recipeTestProps";
import * as userTestProps from "../../../../../../../tests/createProps/userTestProps";
import { TestImagesRepo } from "../../../../../../../tests/repos/TestImagesRepo";
import { TestRecipesRepo } from "../../../../../../../tests/repos/TestRecipesRepo";
import { TestUsersRepo } from "../../../../../../../tests/repos/TestUsersRepo";
import { Recipe } from "../../../../../../domain/entities/recipe/Recipe";
import { User } from "../../../../../../domain/entities/user/User";
import { loginInAPITests } from "../../../../__tests__/loginInAPITests";
import { logoutInAPITests } from "../../../../__tests__/logoutInAPITests";
import { registerUserInAPITests } from "../../../../__tests__/registerUserInAPITests";
import { POST } from "../route";

describe("POST /api/recipe/[recipeId]/duplicate", () => {
  let user1: User;
  let user1Id: string;
  let testRecipe: Recipe;

  beforeEach(async () => {
    TestRecipesRepo.clearForTesting();
    TestUsersRepo.clearForTesting();
    TestImagesRepo.clearForTesting();

    user1 = userTestProps.createTestUser();
    await registerUserInAPITests(user1.email, user1.name);
    user1Id = (await TestUsersRepo.getUserByEmail(user1.email))!.id;

    const recipeProps = recipeTestProps.validRecipePropsWithIngredientLines(1);
    testRecipe = Recipe.create({
      ...recipeProps,
      userId: user1Id,
      imageUrl: undefined,
    });
    await TestRecipesRepo.saveRecipe(testRecipe);

    await logoutInAPITests();
  });

  it("returns JSEND format if user is not logged in", async () => {
    const response = await POST(
      new Request(`http://localhost/api/recipe/${testRecipe.id}/duplicate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }) as NextRequest,
      { params: Promise.resolve({ recipeId: testRecipe.id }) },
    );

    const data = await response.json();

    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("data");
  });

  it("should return JSEND format if user is logged in", async () => {
    await loginInAPITests(user1.email);

    const response = await POST(
      new Request(`http://localhost/api/recipe/${testRecipe.id}/duplicate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }) as NextRequest,
      { params: Promise.resolve({ recipeId: testRecipe.id }) },
    );

    const data = await response.json();

    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("data");
  });

  it("should duplicate the recipe", async () => {
    await loginInAPITests(user1.email);

    const response = await POST(
      new Request(`http://localhost/api/recipe/${testRecipe.id}/duplicate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }) as NextRequest,
      { params: Promise.resolve({ recipeId: testRecipe.id }) },
    );

    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.data).toHaveProperty("userId", user1Id);
    expect(data.data.id).not.toBe(testRecipe.id);
  });

  it("should use provided newName for duplicated recipe", async () => {
    await loginInAPITests(user1.email);

    const newName = "My Custom Copy";

    const response = await POST(
      new Request(`http://localhost/api/recipe/${testRecipe.id}/duplicate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newName }),
      }) as NextRequest,
      { params: Promise.resolve({ recipeId: testRecipe.id }) },
    );

    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.data).toHaveProperty("name", newName);
  });

  describe("Errors", () => {
    it("should return 401 if user is not logged in", async () => {
      const response = await POST(
        new Request(`http://localhost/api/recipe/${testRecipe.id}/duplicate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        }) as NextRequest,
        { params: Promise.resolve({ recipeId: testRecipe.id }) },
      );

      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toHaveProperty("status", "fail");
      expect(data.data).toHaveProperty("message");
    });

    it("should return 404 if recipe does not exist", async () => {
      await loginInAPITests(user1.email);

      const response = await POST(
        new Request(
          "http://localhost/api/recipe/non-existent-recipe/duplicate",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
          },
        ) as NextRequest,
        { params: Promise.resolve({ recipeId: "non-existent-recipe" }) },
      );

      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("status", "fail");
      expect(data.data).toHaveProperty("message");
    });
  });
});
