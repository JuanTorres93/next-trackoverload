import type { NextRequest } from "next/server";

import { CreateIngredientLineData } from "shared";

import * as userTestProps from "../../../../../tests/createProps/userTestProps";
import { TestExternalIngredientsRefRepo } from "../../../../../tests/repos/TestExternalIngredientsRefRepo";
import { TestIngredientsRepo } from "../../../../../tests/repos/TestIngredientsRepo";
import { TestRecipesRepo } from "../../../../../tests/repos/TestRecipesRepo";
import { TestUsersRepo } from "../../../../../tests/repos/TestUsersRepo";
import { User } from "../../../../domain/entities/user/User";
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
  let user1: User;
  let user1Id: string;
  let user2Id: string;

  beforeEach(async () => {
    TestRecipesRepo.clearForTesting();
    TestUsersRepo.clearForTesting();
    TestIngredientsRepo.clearForTesting();
    TestExternalIngredientsRefRepo.clearForTesting();

    user1 = userTestProps.createTestUser();

    const user2 = userTestProps.createTestUser({
      email: "user2@example.com",
    });

    await registerUserInAPITests(user1.email, user1.name);
    await registerUserInAPITests(user2.email, user2.name);

    user1Id = (await TestUsersRepo.getUserByEmail(user1.email))!.id;
    user2Id = (await TestUsersRepo.getUserByEmail(user2.email))!.id;

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
