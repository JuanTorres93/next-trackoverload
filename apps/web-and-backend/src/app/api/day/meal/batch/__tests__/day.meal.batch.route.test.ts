import type { NextRequest } from "next/server";

import * as recipeTestProps from "../../../../../../../tests/createProps/recipeTestProps";
import * as userTestProps from "../../../../../../../tests/createProps/userTestProps";
import { Recipe } from "../../../../../../domain/entities/recipe/Recipe";
import { User } from "../../../../../../domain/entities/user/User";
import { MemoryDaysRepo } from "../../../../../../infra/repos/memory/MemoryDaysRepo";
import { MemoryMealsRepo } from "../../../../../../infra/repos/memory/MemoryMealsRepo";
import { MemoryRecipesRepo } from "../../../../../../infra/repos/memory/MemoryRecipesRepo";
import { MemoryUsersRepo } from "../../../../../../infra/repos/memory/MemoryUsersRepo";
import { AppDaysRepo } from "../../../../../../interface-adapters/app/repos/AppDaysRepo";
import { AppMealsRepo } from "../../../../../../interface-adapters/app/repos/AppMealsRepo";
import { AppRecipesRepo } from "../../../../../../interface-adapters/app/repos/AppRecipesRepo";
import { AppUsersRepo } from "../../../../../../interface-adapters/app/repos/AppUsersRepo";
import { loginInAPITests } from "../../../../__tests__/loginInAPITests";
import { logoutInAPITests } from "../../../../__tests__/logoutInAPITests";
import { registerUserInAPITests } from "../../../../__tests__/registerUserInAPITests";
import { POST } from "../route";

describe("POST /api/day/meal/batch", () => {
  let daysRepo: MemoryDaysRepo;
  let mealsRepo: MemoryMealsRepo;
  let recipesRepo: MemoryRecipesRepo;
  let usersRepo: MemoryUsersRepo;
  let user1: User;
  let user1Id: string;
  let testRecipe: Recipe;

  const dayIds = ["20231001", "20231002"];

  beforeEach(async () => {
    daysRepo = AppDaysRepo as MemoryDaysRepo;
    mealsRepo = AppMealsRepo as MemoryMealsRepo;
    recipesRepo = AppRecipesRepo as MemoryRecipesRepo;
    usersRepo = AppUsersRepo as MemoryUsersRepo;

    daysRepo.clearForTesting();
    mealsRepo.clearForTesting();
    recipesRepo.clearForTesting();
    usersRepo.clearForTesting();

    user1 = userTestProps.createTestUser();
    await registerUserInAPITests(user1.email, user1.name);
    user1Id = (await usersRepo.getUserByEmail(user1.email))!.id;

    testRecipe = recipeTestProps.createTestRecipe({ userId: user1Id }, 1);
    await recipesRepo.saveRecipe(testRecipe);

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
