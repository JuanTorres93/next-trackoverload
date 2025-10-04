import { beforeEach, describe, expect, it } from 'vitest';
import { AddIngredientToMealUsecase } from '../AddIngredientToMeal.usecase';
import { MemoryMealsRepo } from '@/infra/memory/MemoryMealsRepo';
import { Meal } from '@/domain/entities/meal/Meal';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { ValidationError, NotFoundError } from '@/domain/common/errors';
import { v4 as uuidv4 } from 'uuid';

describe('AddIngredientToMealUsecase', () => {
  let mealsRepo: MemoryMealsRepo;
  let addIngredientToMealUsecase: AddIngredientToMealUsecase;
  let testMeal: Meal;
  let newIngredientLine: IngredientLine;

  beforeEach(() => {
    mealsRepo = new MemoryMealsRepo();
    addIngredientToMealUsecase = new AddIngredientToMealUsecase(mealsRepo);

    const testIngredient = Ingredient.create({
      id: uuidv4(),
      name: 'Chicken Breast',
      nutritionalInfoPer100g: {
        calories: 165,
        protein: 31,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const testIngredientLine = IngredientLine.create({
      id: uuidv4(),
      ingredient: testIngredient,
      quantityInGrams: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    testMeal = Meal.create({
      id: uuidv4(),
      name: 'Grilled Chicken Meal',
      ingredientLines: [testIngredientLine],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const newIngredient = Ingredient.create({
      id: uuidv4(),
      name: 'Rice',
      nutritionalInfoPer100g: {
        calories: 130,
        protein: 2.7,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    newIngredientLine = IngredientLine.create({
      id: uuidv4(),
      ingredient: newIngredient,
      quantityInGrams: 150,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it('should add ingredient to meal successfully', async () => {
    await mealsRepo.saveMeal(testMeal);
    const originalIngredientCount = testMeal.ingredientLines.length;

    const request = {
      mealId: testMeal.id,
      ingredientLine: newIngredientLine,
    };

    const result = await addIngredientToMealUsecase.execute(request);

    expect(result.ingredientLines).toHaveLength(originalIngredientCount + 1);
    expect(result.ingredientLines).toContain(newIngredientLine);
  });

  it('should throw NotFoundError when meal does not exist', async () => {
    const request = {
      mealId: 'non-existent-id',
      ingredientLine: newIngredientLine,
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
      mealId: testMeal.id,
      ingredientLine: newIngredientLine,
    };

    const result = await addIngredientToMealUsecase.execute(request);

    expect(result.updatedAt.getTime()).toBeGreaterThan(
      originalUpdatedAt.getTime()
    );
  });
});
