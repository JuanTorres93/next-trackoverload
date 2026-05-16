import type { NextRequest } from "next/server";

import * as dayTestProps from "../../../../../../../../tests/createProps/dayTestProps";
import * as mealTestProps from "../../../../../../../../tests/createProps/mealTestProps";
import * as recipeTestProps from "../../../../../../../../tests/createProps/recipeTestProps";
import * as userTestProps from "../../../../../../../../tests/createProps/userTestProps";
import { Day } from "../../../../../../../domain/entities/day/Day";
import { Meal } from "../../../../../../../domain/entities/meal/Meal";
import { Recipe } from "../../../../../../../domain/entities/recipe/Recipe";
import { User } from "../../../../../../../domain/entities/user/User";
import { MemoryDaysRepo } from "../../../../../../../infra/repos/memory/MemoryDaysRepo";
import { MemoryFakeMealsRepo } from "../../../../../../../infra/repos/memory/MemoryFakeMealsRepo";
import { MemoryMealsRepo } from "../../../../../../../infra/repos/memory/MemoryMealsRepo";
import { MemoryRecipesRepo } from "../../../../../../../infra/repos/memory/MemoryRecipesRepo";
import { MemoryUsersRepo } from "../../../../../../../infra/repos/memory/MemoryUsersRepo";
import { AppDaysRepo } from "../../../../../../../interface-adapters/app/repos/AppDaysRepo";
import { AppFakeMealsRepo } from "../../../../../../../interface-adapters/app/repos/AppFakeMealsRepo";
import { AppMealsRepo } from "../../../../../../../interface-adapters/app/repos/AppMealsRepo";
import { AppRecipesRepo } from "../../../../../../../interface-adapters/app/repos/AppRecipesRepo";
import { AppUsersRepo } from "../../../../../../../interface-adapters/app/repos/AppUsersRepo";
import { loginInAPITests } from "../../../../../__tests__/loginInAPITests";
import { logoutInAPITests } from "../../../../../__tests__/logoutInAPITests";
import { registerUserInAPITests } from "../../../../../__tests__/registerUserInAPITests";
import { DELETE, PUT } from "../route";

describe("PUT /api/day/[dayId]/meal/[mealId] - replace by another meal", () => {
  let daysRepo: MemoryDaysRepo;
  let mealsRepo: MemoryMealsRepo;
  let recipesRepo: MemoryRecipesRepo;
  let usersRepo: MemoryUsersRepo;
  let user1: User;
  let user1Id: string;
  let testDay: Day;
  let testMeal: Meal;
  let testRecipe: Recipe;

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

    testMeal = mealTestProps.createTestMeal({ userId: user1Id });
    await mealsRepo.saveMeal(testMeal);

    testDay = dayTestProps.createEmptyTestDay({ userId: user1Id });
    testDay.addMeal(testMeal.id);
    await daysRepo.saveDay(testDay);

    testRecipe = recipeTestProps.createTestRecipe({ userId: user1Id }, 1);
    await recipesRepo.saveRecipe(testRecipe);

    await logoutInAPITests();
  });

  it("returns JSEND format if user is not logged in", async () => {
    const response = await PUT(
      new Request(
        `http://localhost/api/day/${testDay.id}/meal/${testMeal.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipeId: testRecipe.id }),
        },
      ) as NextRequest,
      {
        params: Promise.resolve({
          dayId: testDay.id,
          mealId: testMeal.id,
        }),
      },
    );

    const data = await response.json();

    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("data");
  });

  it("should replace meal by another meal from recipe", async () => {
    await loginInAPITests(user1.email);

    const response = await PUT(
      new Request(
        `http://localhost/api/day/${testDay.id}/meal/${testMeal.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipeId: testRecipe.id }),
        },
      ) as NextRequest,
      {
        params: Promise.resolve({
          dayId: testDay.id,
          mealId: testMeal.id,
        }),
      },
    );

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.mealIds).toHaveLength(1);
    expect(data.data.mealIds).not.toContain(testMeal.id);
  });

  describe("Errors", () => {
    it("should return 401 if user is not logged in", async () => {
      const response = await PUT(
        new Request(
          `http://localhost/api/day/${testDay.id}/meal/${testMeal.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recipeId: testRecipe.id }),
          },
        ) as NextRequest,
        {
          params: Promise.resolve({
            dayId: testDay.id,
            mealId: testMeal.id,
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

      const response = await PUT(
        new Request(
          `http://localhost/api/day/${testDay.id}/meal/${testMeal.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recipeId: "non-existent" }),
          },
        ) as NextRequest,
        {
          params: Promise.resolve({
            dayId: testDay.id,
            mealId: testMeal.id,
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

describe("PUT /api/day/[dayId]/meal/[mealId] - replace by fake meal", () => {
  let daysRepo: MemoryDaysRepo;
  let mealsRepo: MemoryMealsRepo;
  let fakeMealsRepo: MemoryFakeMealsRepo;
  let usersRepo: MemoryUsersRepo;
  let user1: User;
  let user1Id: string;
  let testDay: Day;
  let testMeal: Meal;

  beforeEach(async () => {
    daysRepo = AppDaysRepo as MemoryDaysRepo;
    mealsRepo = AppMealsRepo as MemoryMealsRepo;
    fakeMealsRepo = AppFakeMealsRepo as MemoryFakeMealsRepo;
    usersRepo = AppUsersRepo as MemoryUsersRepo;

    daysRepo.clearForTesting();
    mealsRepo.clearForTesting();
    fakeMealsRepo.clearForTesting();
    usersRepo.clearForTesting();

    user1 = userTestProps.createTestUser();
    await registerUserInAPITests(user1.email, user1.name);
    user1Id = (await usersRepo.getUserByEmail(user1.email))!.id;

    testMeal = mealTestProps.createTestMeal({ userId: user1Id });
    await mealsRepo.saveMeal(testMeal);

    testDay = dayTestProps.createEmptyTestDay({ userId: user1Id });
    testDay.addMeal(testMeal.id);
    await daysRepo.saveDay(testDay);

    await logoutInAPITests();
  });

  it("should replace meal by fake meal", async () => {
    await loginInAPITests(user1.email);

    const response = await PUT(
      new Request(
        `http://localhost/api/day/${testDay.id}/meal/${testMeal.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Quick snack",
            calories: 200,
            protein: 10,
          }),
        },
      ) as NextRequest,
      {
        params: Promise.resolve({
          dayId: testDay.id,
          mealId: testMeal.id,
        }),
      },
    );

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.mealIds).toHaveLength(0);
    expect(data.data.fakeMealIds).toHaveLength(1);
  });
});

describe("DELETE /api/day/[dayId]/meal/[mealId]", () => {
  let daysRepo: MemoryDaysRepo;
  let mealsRepo: MemoryMealsRepo;
  let usersRepo: MemoryUsersRepo;
  let user1: User;
  let user1Id: string;
  let testDay: Day;
  let testMeal: Meal;

  beforeEach(async () => {
    daysRepo = AppDaysRepo as MemoryDaysRepo;
    mealsRepo = AppMealsRepo as MemoryMealsRepo;
    usersRepo = AppUsersRepo as MemoryUsersRepo;

    daysRepo.clearForTesting();
    mealsRepo.clearForTesting();
    usersRepo.clearForTesting();

    user1 = userTestProps.createTestUser();
    await registerUserInAPITests(user1.email, user1.name);
    user1Id = (await usersRepo.getUserByEmail(user1.email))!.id;

    testMeal = mealTestProps.createTestMeal({ userId: user1Id });
    await mealsRepo.saveMeal(testMeal);

    testDay = dayTestProps.createEmptyTestDay({ userId: user1Id });
    testDay.addMeal(testMeal.id);
    await daysRepo.saveDay(testDay);

    await logoutInAPITests();
  });

  it("returns JSEND format if user is not logged in", async () => {
    const response = await DELETE(
      new Request(`http://localhost/api/day/${testDay.id}/meal/${testMeal.id}`),
      {
        params: Promise.resolve({
          dayId: testDay.id,
          mealId: testMeal.id,
        }),
      },
    );

    const data = await response.json();

    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("data");
  });

  it("should remove meal from day", async () => {
    await loginInAPITests(user1.email);

    const response = await DELETE(
      new Request(`http://localhost/api/day/${testDay.id}/meal/${testMeal.id}`),
      {
        params: Promise.resolve({
          dayId: testDay.id,
          mealId: testMeal.id,
        }),
      },
    );

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.mealIds).toHaveLength(0);
  });

  describe("Errors", () => {
    it("should return 401 if user is not logged in", async () => {
      const response = await DELETE(
        new Request(
          `http://localhost/api/day/${testDay.id}/meal/${testMeal.id}`,
        ),
        {
          params: Promise.resolve({
            dayId: testDay.id,
            mealId: testMeal.id,
          }),
        },
      );

      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toHaveProperty("status", "fail");
      expect(data.data).toHaveProperty("message");
    });

    it("should return 404 if day does not exist", async () => {
      await loginInAPITests(user1.email);

      const response = await DELETE(
        new Request(`http://localhost/api/day/20991231/meal/${testMeal.id}`),
        {
          params: Promise.resolve({
            dayId: "20991231",
            mealId: testMeal.id,
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
