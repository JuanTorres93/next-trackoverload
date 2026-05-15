import type { NextRequest } from "next/server";

import { loginInAPITests } from "@/app/api/__tests__/loginInAPITests";
import { logoutInAPITests } from "@/app/api/__tests__/logoutInAPITests";
import { registerUserInAPITests } from "@/app/api/__tests__/registerUserInAPITests";
import { Recipe } from "@/domain/entities/recipe/Recipe";
import { User } from "@/domain/entities/user/User";
import { MemoryImagesRepo } from "@/infra/repos/memory/MemoryImagesRepo";
import { MemoryRecipesRepo } from "@/infra/repos/memory/MemoryRecipesRepo";
import { MemoryUsersRepo } from "@/infra/repos/memory/MemoryUsersRepo";
import { AppImagesRepo } from "@/interface-adapters/app/repos/AppImagesRepo";
import { AppRecipesRepo } from "@/interface-adapters/app/repos/AppRecipesRepo";
import { AppUsersRepo } from "@/interface-adapters/app/repos/AppUsersRepo";

import * as recipeTestProps from "../../../../../../../tests/createProps/recipeTestProps";
import * as userTestProps from "../../../../../../../tests/createProps/userTestProps";
import { POST } from "../route";

describe("POST /api/recipe/[recipeId]/duplicate", () => {
  let recipesRepo: MemoryRecipesRepo;
  let usersRepo: MemoryUsersRepo;
  let imagesRepo: MemoryImagesRepo;

  let user1: User;
  let user1Id: string;
  let testRecipe: Recipe;

  beforeEach(async () => {
    recipesRepo = AppRecipesRepo as MemoryRecipesRepo;
    usersRepo = AppUsersRepo as MemoryUsersRepo;
    imagesRepo = AppImagesRepo as MemoryImagesRepo;

    recipesRepo.clearForTesting();
    usersRepo.clearForTesting();
    imagesRepo.clearForTesting();

    user1 = userTestProps.createTestUser();
    await registerUserInAPITests(user1.email, user1.name);
    user1Id = (await usersRepo.getUserByEmail(user1.email))!.id;

    const recipeProps = recipeTestProps.validRecipePropsWithIngredientLines(1);
    testRecipe = Recipe.create({
      ...recipeProps,
      userId: user1Id,
      imageUrl: undefined,
    });
    await recipesRepo.saveRecipe(testRecipe);

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
