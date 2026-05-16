import type { NextRequest } from "next/server";

import * as ingredientTestProps from "../../../../../../tests/createProps/ingredientTestProps";
import * as mealTestProps from "../../../../../../tests/createProps/mealTestProps";
import * as recipeTestProps from "../../../../../../tests/createProps/recipeTestProps";
import * as userTestProps from "../../../../../../tests/createProps/userTestProps";
import { Meal } from "../../../../../domain/entities/meal/Meal";
import { Recipe } from "../../../../../domain/entities/recipe/Recipe";
import { User } from "../../../../../domain/entities/user/User";
import { MemoryIngredientsRepo } from "../../../../../infra/repos/memory/MemoryIngredientsRepo";
import { MemoryMealsRepo } from "../../../../../infra/repos/memory/MemoryMealsRepo";
import { MemoryRecipesRepo } from "../../../../../infra/repos/memory/MemoryRecipesRepo";
import { MemoryUsersRepo } from "../../../../../infra/repos/memory/MemoryUsersRepo";
import { AppIngredientsRepo } from "../../../../../interface-adapters/app/repos/AppIngredientsRepo";
import { AppMealsRepo } from "../../../../../interface-adapters/app/repos/AppMealsRepo";
import { AppRecipesRepo } from "../../../../../interface-adapters/app/repos/AppRecipesRepo";
import { AppUsersRepo } from "../../../../../interface-adapters/app/repos/AppUsersRepo";
import { loginInAPITests } from "../../../__tests__/loginInAPITests";
import { logoutInAPITests } from "../../../__tests__/logoutInAPITests";
import { registerUserInAPITests } from "../../../__tests__/registerUserInAPITests";
import { PUT } from "../route";

describe("PUT /api/ingredientline/[ingredientLineId]", () => {
  let recipesRepo: MemoryRecipesRepo;
  let mealsRepo: MemoryMealsRepo;
  let usersRepo: MemoryUsersRepo;
  let ingredientsRepo: MemoryIngredientsRepo;

  let user1: User;
  let user1Id: string;
  let testRecipe: Recipe;
  let testMeal: Meal;

  beforeEach(async () => {
    recipesRepo = AppRecipesRepo as MemoryRecipesRepo;
    mealsRepo = AppMealsRepo as MemoryMealsRepo;
    usersRepo = AppUsersRepo as MemoryUsersRepo;
    ingredientsRepo = AppIngredientsRepo as MemoryIngredientsRepo;

    recipesRepo.clearForTesting();
    mealsRepo.clearForTesting();
    usersRepo.clearForTesting();
    ingredientsRepo.clearForTesting();

    user1 = userTestProps.createTestUser();
    await registerUserInAPITests(user1.email, user1.name);
    user1Id = (await usersRepo.getUserByEmail(user1.email))!.id;

    testRecipe = recipeTestProps.createTestRecipe({ userId: user1Id }, 1);
    await recipesRepo.saveRecipe(testRecipe);

    testMeal = mealTestProps.createTestMeal({ userId: user1Id });
    await mealsRepo.saveMeal(testMeal);

    await logoutInAPITests();
  });

  const recipeIngredientLineId =
    recipeTestProps.validRecipePropsWithIngredientLines(1).ingredientLines[0]
      .id;

  const mealIngredientLineId =
    mealTestProps.validMealWithIngredientLines().ingredientLines[0].id;

  it("returns JSEND format if user is not logged in", async () => {
    const response = await PUT(
      new Request(
        `http://localhost/api/ingredientline/${recipeIngredientLineId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            parentEntityType: "recipe",
            parentEntityId: testRecipe.id,
            quantityInGrams: 300,
          }),
        },
      ) as NextRequest,
      {
        params: Promise.resolve({ ingredientLineId: recipeIngredientLineId }),
      },
    );

    const data = await response.json();

    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("data");
  });

  it("should return JSEND format if user is logged in", async () => {
    await loginInAPITests(user1.email);

    const response = await PUT(
      new Request(
        `http://localhost/api/ingredientline/${recipeIngredientLineId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            parentEntityType: "recipe",
            parentEntityId: testRecipe.id,
            quantityInGrams: 300,
          }),
        },
      ) as NextRequest,
      {
        params: Promise.resolve({ ingredientLineId: recipeIngredientLineId }),
      },
    );

    const data = await response.json();

    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("data");
  });

  it("should update quantityInGrams for a recipe ingredient line", async () => {
    await loginInAPITests(user1.email);

    const newQuantity = 350;

    const response = await PUT(
      new Request(
        `http://localhost/api/ingredientline/${recipeIngredientLineId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            parentEntityType: "recipe",
            parentEntityId: testRecipe.id,
            quantityInGrams: newQuantity,
          }),
        },
      ) as NextRequest,
      {
        params: Promise.resolve({ ingredientLineId: recipeIngredientLineId }),
      },
    );

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toHaveProperty("id", recipeIngredientLineId);
    expect(data.data).toHaveProperty("quantityInGrams", newQuantity);
  });

  it("should update ingredientId for a recipe ingredient line", async () => {
    await loginInAPITests(user1.email);

    const newIngredient = ingredientTestProps.createTestIngredient({
      id: "new-ingredient-id",
    });
    await ingredientsRepo.saveIngredient(newIngredient);

    const response = await PUT(
      new Request(
        `http://localhost/api/ingredientline/${recipeIngredientLineId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            parentEntityType: "recipe",
            parentEntityId: testRecipe.id,
            ingredientId: newIngredient.id,
          }),
        },
      ) as NextRequest,
      {
        params: Promise.resolve({ ingredientLineId: recipeIngredientLineId }),
      },
    );

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toHaveProperty("id", recipeIngredientLineId);
    expect(data.data.ingredient).toHaveProperty("id", newIngredient.id);
  });

  it("should update quantityInGrams for a meal ingredient line", async () => {
    await loginInAPITests(user1.email);

    const newQuantity = 250;

    const response = await PUT(
      new Request(
        `http://localhost/api/ingredientline/${mealIngredientLineId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            parentEntityType: "meal",
            parentEntityId: testMeal.id,
            quantityInGrams: newQuantity,
          }),
        },
      ) as NextRequest,
      {
        params: Promise.resolve({ ingredientLineId: mealIngredientLineId }),
      },
    );

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toHaveProperty("id", mealIngredientLineId);
    expect(data.data).toHaveProperty("quantityInGrams", newQuantity);
  });

  describe("Errors", () => {
    it("should return 401 if user is not logged in", async () => {
      const response = await PUT(
        new Request(
          `http://localhost/api/ingredientline/${recipeIngredientLineId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              parentEntityType: "recipe",
              parentEntityId: testRecipe.id,
              quantityInGrams: 300,
            }),
          },
        ) as NextRequest,
        {
          params: Promise.resolve({ ingredientLineId: recipeIngredientLineId }),
        },
      );

      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toHaveProperty("status", "fail");
      expect(data.data).toHaveProperty("message");
    });

    it("should return 404 if ingredient line does not exist in the parent entity", async () => {
      await loginInAPITests(user1.email);

      const response = await PUT(
        new Request(
          "http://localhost/api/ingredientline/non-existent-line-id",
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              parentEntityType: "recipe",
              parentEntityId: testRecipe.id,
              quantityInGrams: 300,
            }),
          },
        ) as NextRequest,
        {
          params: Promise.resolve({
            ingredientLineId: "non-existent-line-id",
          }),
        },
      );

      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("status", "fail");
      expect(data.data).toHaveProperty("message");
    });

    it("should return 404 if parent recipe does not exist", async () => {
      await loginInAPITests(user1.email);

      const response = await PUT(
        new Request(
          `http://localhost/api/ingredientline/${recipeIngredientLineId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              parentEntityType: "recipe",
              parentEntityId: "non-existent-recipe-id",
              quantityInGrams: 300,
            }),
          },
        ) as NextRequest,
        {
          params: Promise.resolve({ ingredientLineId: recipeIngredientLineId }),
        },
      );

      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("status", "fail");
      expect(data.data).toHaveProperty("message");
    });

    it("should return 404 if parent meal does not exist", async () => {
      await loginInAPITests(user1.email);

      const response = await PUT(
        new Request(
          `http://localhost/api/ingredientline/${mealIngredientLineId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              parentEntityType: "meal",
              parentEntityId: "non-existent-meal-id",
              quantityInGrams: 250,
            }),
          },
        ) as NextRequest,
        {
          params: Promise.resolve({ ingredientLineId: mealIngredientLineId }),
        },
      );

      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("status", "fail");
      expect(data.data).toHaveProperty("message");
    });
  });
});
