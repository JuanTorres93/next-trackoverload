import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import {
  AuthError,
  NotFoundError,
  ValidationError,
} from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Meal } from '@/domain/entities/meal/Meal';
import { MemoryMealsRepo } from '@/infra/memory/MemoryMealsRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { AddIngredientToMealUsecase } from '../AddIngredientToMeal.usecase';

describe('AddIngredientToMealUsecase', () => {
  let mealsRepo: MemoryMealsRepo;
  let addIngredientToMealUsecase: AddIngredientToMealUsecase;
  let testMeal: Meal;
  let newIngredientLine: IngredientLine;

  beforeEach(() => {
    mealsRepo = new MemoryMealsRepo();
    addIngredientToMealUsecase = new AddIngredientToMealUsecase(mealsRepo);

    const testIngredient = Ingredient.create({
      ...vp.validIngredientProps,
      name: 'Chicken Breast',
      nutritionalInfoPer100g: {
        calories: 165,
        protein: 31,
      },
    });

    const testIngredientLine = IngredientLine.create({
      ...vp.ingredientLineRecipePropsNoIngredient,
      ingredient: testIngredient,
      quantityInGrams: 200,
    });

    testMeal = Meal.create({
      ...vp.mealPropsNoIngredientLines,
      ingredientLines: [testIngredientLine],
    });

    const newIngredient = Ingredient.create({
      ...vp.validIngredientProps,
      name: 'Rice',
      nutritionalInfoPer100g: {
        calories: 130,
        protein: 2.7,
      },
    });

    newIngredientLine = IngredientLine.create({
      ...vp.ingredientLineRecipePropsNoIngredient,
      ingredient: newIngredient,
      quantityInGrams: 150,
    });
  });

  it('should add ingredient to meal successfully', async () => {
    await mealsRepo.saveMeal(testMeal);
    const originalIngredientCount = testMeal.ingredientLines.length;

    const request = {
      mealId: testMeal.id,
      ingredientLine: newIngredientLine,
      userId: vp.userId,
    };

    const result = await addIngredientToMealUsecase.execute(request);

    expect(result.ingredientLines).toHaveLength(originalIngredientCount + 1);

    const ingredientIds = result.ingredientLines.map(
      (line) => line.ingredient.id
    );
    expect(ingredientIds).toContain(newIngredientLine.ingredient.id);
  });

  it('should return MealDTO', async () => {
    await mealsRepo.saveMeal(testMeal);

    const request = {
      mealId: testMeal.id,
      ingredientLine: newIngredientLine,
      userId: vp.userId,
    };

    const result = await addIngredientToMealUsecase.execute(request);

    expect(result).not.toBeInstanceOf(Meal);

    for (const prop of dto.mealDTOProperties) {
      expect(result).toHaveProperty(prop);
    }
  });

  it('should throw NotFoundError when meal does not exist', async () => {
    const request = {
      mealId: 'non-existent-id',
      ingredientLine: newIngredientLine,
      userId: vp.userId,
    };

    await expect(addIngredientToMealUsecase.execute(request)).rejects.toThrow(
      NotFoundError
    );
  });

  it('should throw ValidationError when mealId is invalid', async () => {
    const invalidIds = [null, undefined, 23, true, {}, ''];

    for (const invalidId of invalidIds) {
      await expect(
        addIngredientToMealUsecase.execute({
          // @ts-expect-error Testing invalid inputs
          mealId: invalidId,
          ingredientLine: newIngredientLine,
        })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw ValidationError when ingredientLine is not an IngredientLine instance', async () => {
    await mealsRepo.saveMeal(testMeal);

    const invalidIngredientLines = [
      'not-an-ingredient-line',
      123,
      {},
      null,
      undefined,
    ];

    for (const invalidIngredientLine of invalidIngredientLines) {
      await expect(
        addIngredientToMealUsecase.execute({
          mealId: testMeal.id,
          // @ts-expect-error Testing invalid inputs
          ingredientLine: invalidIngredientLine,
        })
      ).rejects.toThrow(ValidationError);
    }
  });

  it("should update meal's updatedAt timestamp", async () => {
    await mealsRepo.saveMeal(testMeal);
    const originalUpdatedAt = testMeal.updatedAt;

    // Wait a bit to ensure timestamp difference
    await new Promise((resolve) => setTimeout(resolve, 2));

    const request = {
      userId: vp.userId,
      mealId: testMeal.id,
      ingredientLine: newIngredientLine,
    };

    const result = await addIngredientToMealUsecase.execute(request);

    expect(new Date(result.updatedAt).getTime()).toBeGreaterThan(
      originalUpdatedAt.getTime()
    );
  });

  it('should throw error if userId is invalid', async () => {
    const invalidUserIds = [null, undefined, 23, true, {}, ''];

    for (const invalidUserId of invalidUserIds) {
      await expect(
        addIngredientToMealUsecase.execute({
          mealId: testMeal.id,
          ingredientLine: newIngredientLine,
          // @ts-expect-error Testing invalid inputs
          userId: invalidUserId,
        })
      ).rejects.toThrow(ValidationError);
    }
  });

  it("should not add ingredient to another user's meal", async () => {
    await mealsRepo.saveMeal(testMeal);

    const request = {
      userId: 'another-user-id',
      mealId: testMeal.id,
      ingredientLine: newIngredientLine,
    };

    await expect(addIngredientToMealUsecase.execute(request)).rejects.toThrow(
      AuthError
    );
  });
});
