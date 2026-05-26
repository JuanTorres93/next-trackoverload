import type { NextRequest } from "next/server";

import * as recipeTestProps from "../../../../../../../tests/createProps/recipeTestProps";
import * as userTestProps from "../../../../../../../tests/createProps/userTestProps";
import { TestDaysRepo } from "../../../../../../../tests/repos/TestDaysRepo";
import { TestMealsRepo } from "../../../../../../../tests/repos/TestMealsRepo";
import { TestRecipesRepo } from "../../../../../../../tests/repos/TestRecipesRepo";
import { TestUsersRepo } from "../../../../../../../tests/repos/TestUsersRepo";
import { Recipe } from "../../../../../../domain/entities/recipe/Recipe";
import { User } from "../../../../../../domain/entities/user/User";
import { loginInAPITests } from "../../../../__tests__/loginInAPITests";
import { logoutInAPITests } from "../../../../__tests__/logoutInAPITests";
import { registerUserInAPITests } from "../../../../__tests__/registerUserInAPITests";
import { POST } from "../route";

describe("POST /api/day/meal/batch", () => {
  let user1: User;
  let user1Id: string;
  let testRecipe: Recipe;

  const dayIds = ["20231001", "20231002"];

  beforeEach(async () => {
    TestDaysRepo.clearForTesting();
    TestMealsRepo.clearForTesting();
    TestRecipesRepo.clearForTesting();
    TestUsersRepo.clearForTesting();

    user1 = userTestProps.createTestUser();
    await registerUserInAPITests(user1.email, user1.name);
    user1Id = (await TestUsersRepo.getUserByEmail(user1.email))!.id;

    testRecipe = recipeTestProps.createTestRecipe({ userId: user1Id }, 1);
    await TestRecipesRepo.saveRecipe(testRecipe);

    await logoutInAPITests();
  });

  it("returns JSEND format if user is not logged in", async () => {
    const response = await POST(
      new Request("http://localhost/api/day/meal/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dayIds, recipeIds: [testRecipe.id] }),
      }) as NextRequest,
    );

    const data = await response.json();

    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("data");
  });

  it("should add meals to multiple days and return 201", async () => {
    await loginInAPITests(user1.email);

    const response = await POST(
      new Request("http://localhost/api/day/meal/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dayIds, recipeIds: [testRecipe.id] }),
      }) as NextRequest,
    );

    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.data).toHaveLength(2);
    for (const day of data.data) {
      expect(day.mealIds).toHaveLength(1);
    }
  });

  describe("Errors", () => {
    it("should return 401 if user is not logged in", async () => {
      const response = await POST(
        new Request("http://localhost/api/day/meal/batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dayIds, recipeIds: [testRecipe.id] }),
        }) as NextRequest,
      );

      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toHaveProperty("status", "fail");
      expect(data.data).toHaveProperty("message");
    });

    it("should return 404 if recipe does not exist", async () => {
      await loginInAPITests(user1.email);

      const response = await POST(
        new Request("http://localhost/api/day/meal/batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dayIds, recipeIds: ["non-existent"] }),
        }) as NextRequest,
      );

      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("status", "fail");
      expect(data.data).toHaveProperty("message");
    });
  });
});
