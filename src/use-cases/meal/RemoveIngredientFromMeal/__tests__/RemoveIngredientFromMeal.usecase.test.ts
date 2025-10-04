import { beforeEach, describe, expect, it } from 'vitest';
import { RemoveIngredientFromMealUsecase } from '../RemoveIngredientFromMeal.usecase';
import { MemoryMealsRepo } from '@/infra/memory/MemoryMealsRepo';
import { Meal } from '@/domain/entities/meal/Meal';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { ValidationError, NotFoundError } from '@/domain/common/errors';
import { v4 as uuidv4 } from 'uuid';

describe('RemoveIngredientFromMealUsecase', () => {
  let mealsRepo: MemoryMealsRepo;
  let removeIngredientFromMealUsecase: RemoveIngredientFromMealUsecase;
  let testMeal: Meal;
  let testIngredient: Ingredient;
  let secondIngredient: Ingredient;

  beforeEach(() => {
    mealsRepo = new MemoryMealsRepo();
    removeIngredientFromMealUsecase = new RemoveIngredientFromMealUsecase(
      mealsRepo
    );

    testIngredient = Ingredient.create({
      id: uuidv4(),
      name: 'Chicken Breast',
      nutritionalInfoPer100g: {
        calories: 165,
        protein: 31,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    secondIngredient = Ingredient.create({
      id: uuidv4(),
      name: 'Rice',
      nutritionalInfoPer100g: {
        calories: 130,
        protein: 2.7,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const firstIngredientLine = IngredientLine.create({
      id: uuidv4(),
      ingredient: testIngredient,
      quantityInGrams: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const secondIngredientLine = IngredientLine.create({
      id: uuidv4(),
      ingredient: secondIngredient,
      quantityInGrams: 150,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    testMeal = Meal.create({
      id: uuidv4(),
      name: 'Chicken with Rice Meal',
      ingredientLines: [firstIngredientLine, secondIngredientLine],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it('should remove ingredient from meal successfully', async () => {
    await mealsRepo.saveMeal(testMeal);
    const originalIngredientCount = testMeal.ingredientLines.length;

    const request = {
      mealId: testMeal.id,
      ingredientId: testIngredient.id,
    };

    const result = await removeIngredientFromMealUsecase.execute(request);

    expect(result.ingredientLines).toHaveLength(originalIngredientCount - 1);
    expect(
      result.ingredientLines.some(
        (line) => line.ingredient.id === testIngredient.id
      )
    ).toBe(false);
    expect(
      result.ingredientLines.some(
        (line) => line.ingredient.id === secondIngredient.id
      )
    ).toBe(true);
  });

  it('should throw NotFoundError when meal does not exist', async () => {
    const request = {
      mealId: 'non-existent-id',
      ingredientId: testIngredient.id,
    };

    await expect(
      removeIngredientFromMealUsecase.execute(request)
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw ValidationError when ingredient is not in the meal', async () => {
    await mealsRepo.saveMeal(testMeal);

    const nonExistentIngredient = Ingredient.create({
      id: uuidv4(),
      name: 'Non-existent',
      nutritionalInfoPer100g: {
        calories: 100,
        protein: 10,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = {
      mealId: testMeal.id,
      ingredientId: nonExistentIngredient.id,
    };

    await expect(
      removeIngredientFromMealUsecase.execute(request)
    ).rejects.toThrow(ValidationError);
  });

  it('should throw ValidationError when mealId is invalid', async () => {
    const invalidIds = [null, undefined, 3, '', true, {}];

    for (const invalidId of invalidIds) {
      await expect(
        removeIngredientFromMealUsecase.execute({
          // @ts-expect-error Testing invalid inputs
          mealId: invalidId,
          ingredientId: testIngredient.id,
        })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw ValidationError when ingredientId is invalid', async () => {
    const invalidIds = [null, undefined, 3, '', true, {}];

    for (const invalidId of invalidIds) {
      await expect(
        removeIngredientFromMealUsecase.execute({
          mealId: testMeal.id,
          // @ts-expect-error Testing invalid inputs
          ingredientId: invalidId,
        })
      ).rejects.toThrow(ValidationError);
    }
  });

  it("should update meal's updatedAt timestamp", async () => {
    await mealsRepo.saveMeal(testMeal);
    const originalUpdatedAt = testMeal.updatedAt;

    // Wait a bit to ensure timestamp difference
    await new Promise((resolve) => setTimeout(resolve, 1));

    const request = {
      mealId: testMeal.id,
      ingredientId: testIngredient.id,
    };

    const result = await removeIngredientFromMealUsecase.execute(request);

    expect(result.updatedAt.getTime()).toBeGreaterThan(
      originalUpdatedAt.getTime()
    );
  });
});
