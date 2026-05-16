import type { NextRequest } from "next/server";

import * as userTestProps from "../../../../../tests/createProps/userTestProps";
import { CreateIngredientLineData } from "../../../../application-layer/use-cases/recipe/common/createIngredientsAndExternalIngredientsForIngredientLineNoSaveInRepo";
import { User } from "../../../../domain/entities/user/User";
import { MemoryExternalIngredientsRefRepo } from "../../../../infra/repos/memory/MemoryExternalIngredientsRefRepo";
import { MemoryIngredientsRepo } from "../../../../infra/repos/memory/MemoryIngredientsRepo";
import { MemoryRecipesRepo } from "../../../../infra/repos/memory/MemoryRecipesRepo";
import { MemoryUsersRepo } from "../../../../infra/repos/memory/MemoryUsersRepo";
import { AppExternalIngredientsRefRepo } from "../../../../interface-adapters/app/repos/AppExternalIngredientsRefRepo";
import { AppIngredientsRepo } from "../../../../interface-adapters/app/repos/AppIngredientsRepo";
import { AppRecipesRepo } from "../../../../interface-adapters/app/repos/AppRecipesRepo";
import { AppUsersRepo } from "../../../../interface-adapters/app/repos/AppUsersRepo";
import { loginInAPITests } from "../../__tests__/loginInAPITests";
import { logoutInAPITests } from "../../__tests__/logoutInAPITests";
import { registerUserInAPITests } from "../../__tests__/registerUserInAPITests";
import { POST } from "../route";

const validIngredientLinesInfo: CreateIngredientLineData[] = [
  {
    externalIngredientId: "ext-id-1",
    source: "openfoodfacts",
    name: "Chicken Breast",
    caloriesPer100g: 165,
    proteinPer100g: 31,
    quantityInGrams: 200,
  },
];

describe("POST /api/recipe", () => {
  let recipesRepo: MemoryRecipesRepo;
  let usersRepo: MemoryUsersRepo;
  let ingredientsRepo: MemoryIngredientsRepo;
  let externalIngredientsRefRepo: MemoryExternalIngredientsRefRepo;

  let user1: User;
  let user1Id: string;
  let user2Id: string;

  beforeEach(async () => {
    recipesRepo = AppRecipesRepo as MemoryRecipesRepo;
    usersRepo = AppUsersRepo as MemoryUsersRepo;
    ingredientsRepo = AppIngredientsRepo as MemoryIngredientsRepo;
    externalIngredientsRefRepo =
      AppExternalIngredientsRefRepo as MemoryExternalIngredientsRefRepo;

    recipesRepo.clearForTesting();
    usersRepo.clearForTesting();
    ingredientsRepo.clearForTesting();
    externalIngredientsRefRepo.clearForTesting();

    user1 = userTestProps.createTestUser();

    const user2 = userTestProps.createTestUser({
      email: "user2@example.com",
    });

    await registerUserInAPITests(user1.email, user1.name);
    await registerUserInAPITests(user2.email, user2.name);

    user1Id = (await usersRepo.getUserByEmail(user1.email))!.id;
    user2Id = (await usersRepo.getUserByEmail(user2.email))!.id;

    await logoutInAPITests();
  });

  it("returns JSEND format if user is not logged in", async () => {
    const response = await POST(
      new Request("http://localhost/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: user1Id,
          name: "My Recipe",
          ingredientLinesInfo: validIngredientLinesInfo,
        }),
      }) as NextRequest,
    );

    const data = await response.json();

    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("data");
  });

  it("should return JSEND format if user is logged in", async () => {
    await loginInAPITests(user1.email);

    const response = await POST(
      new Request("http://localhost/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: user1Id,
          name: "My Recipe",
          ingredientLinesInfo: validIngredientLinesInfo,
        }),
      }) as NextRequest,
    );

    const data = await response.json();

    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("data");
  });

  it("should create a recipe and return it", async () => {
    await loginInAPITests(user1.email);

    const response = await POST(
      new Request("http://localhost/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: user1Id,
          name: "My Recipe",
          ingredientLinesInfo: validIngredientLinesInfo,
        }),
      }) as NextRequest,
    );

    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.data).toHaveProperty("id");
    expect(data.data).toHaveProperty("userId", user1Id);
    expect(data.data).toHaveProperty("name", "My Recipe");
    expect(data.data.ingredientLines).toHaveLength(1);
  });

  describe("Errors", () => {
    it("should return 401 if user is not logged in", async () => {
      const response = await POST(
        new Request("http://localhost/api/recipe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetUserId: user1Id,
            name: "My Recipe",
            ingredientLinesInfo: validIngredientLinesInfo,
          }),
        }) as NextRequest,
      );

      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toHaveProperty("status", "fail");
      expect(data.data).toHaveProperty("message");
    });

    it("should return 404 if target user does not exist", async () => {
      await loginInAPITests(user1.email);

      const nonExistentUserId = "non-existent-user";

      const response = await POST(
        new Request("http://localhost/api/recipe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetUserId: nonExistentUserId,
            name: "My Recipe",
            ingredientLinesInfo: validIngredientLinesInfo,
          }),
        }) as NextRequest,
      );

      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("status", "fail");
      expect(data.data).toHaveProperty("message");
    });

    it("should return 404 if trying to create a recipe for another user", async () => {
      await loginInAPITests(user1.email);

      const response = await POST(
        new Request("http://localhost/api/recipe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetUserId: user2Id,
            name: "My Recipe",
            ingredientLinesInfo: validIngredientLinesInfo,
          }),
        }) as NextRequest,
      );

      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("status", "fail");
      expect(data.data).toHaveProperty("message");
    });
  });
});
