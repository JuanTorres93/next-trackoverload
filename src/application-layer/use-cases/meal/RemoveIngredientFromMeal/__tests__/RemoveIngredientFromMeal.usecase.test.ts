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
import { RemoveIngredientFromMealUsecase } from '../RemoveIngredientFromMeal.usecase';

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
      ...vp.validIngredientProps,
    });

    secondIngredient = Ingredient.create({
      ...vp.validIngredientProps,
      id: 'ing2',
    });

    const firstIngredientLine = IngredientLine.create({
      ...vp.ingredientLineRecipePropsNoIngredient,
      ingredient: testIngredient,
    });

    const secondIngredientLine = IngredientLine.create({
      ...vp.ingredientLineRecipePropsNoIngredient,
      ingredient: secondIngredient,
    });

    testMeal = Meal.create({
      ...vp.mealPropsNoIngredientLines,
      ingredientLines: [firstIngredientLine, secondIngredientLine],
    });
  });

  it('should remove ingredient from meal successfully', async () => {
    await mealsRepo.saveMeal(testMeal);
    const originalIngredientCount = testMeal.ingredientLines.length;

    const request = {
      userId: vp.userId,
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

  it('should return MealDTO', async () => {
    await mealsRepo.saveMeal(testMeal);

    const request = {
      userId: vp.userId,
      mealId: testMeal.id,
      ingredientId: testIngredient.id,
    };

    const result = await removeIngredientFromMealUsecase.execute(request);

    expect(result).not.toBeInstanceOf(Meal);

    for (const prop of dto.mealDTOProperties) {
      expect(result).toHaveProperty(prop);
    }
  });

  it('should throw NotFoundError when meal does not exist', async () => {
    const request = {
      mealId: 'non-existent-id',
      ingredientId: testIngredient.id,
      userId: vp.userId,
    };

    await expect(
      removeIngredientFromMealUsecase.execute(request)
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw ValidationError when ingredient is not in the meal', async () => {
    await mealsRepo.saveMeal(testMeal);

    const nonExistentIngredient = Ingredient.create({
      ...vp.validIngredientProps,
      id: 'not-in-meal',
      name: 'Non-existent',
    });

    const request = {
      userId: vp.userId,
      mealId: testMeal.id,
      ingredientId: nonExistentIngredient.id,
    };

    await expect(
      removeIngredientFromMealUsecase.execute(request)
    ).rejects.toThrow(ValidationError);
  });

  it("should update meal's updatedAt timestamp", async () => {
    await mealsRepo.saveMeal(testMeal);
    const originalUpdatedAt = testMeal.updatedAt;

    // Wait a bit to ensure timestamp difference
    await new Promise((resolve) => setTimeout(resolve, 2));

    const request = {
      userId: vp.userId,
      mealId: testMeal.id,
      ingredientId: testIngredient.id,
    };

    const result = await removeIngredientFromMealUsecase.execute(request);

    expect(new Date(result.updatedAt).getTime()).toBeGreaterThan(
      originalUpdatedAt.getTime()
    );
  });

  it('should throw error when trying to remove an ingredient from other users meal', async () => {
    await mealsRepo.saveMeal(testMeal);

    const request = {
      userId: 'other-user-id',
      mealId: testMeal.id,
      ingredientId: testIngredient.id,
    };

    await expect(
      removeIngredientFromMealUsecase.execute(request)
    ).rejects.toThrow(AuthError);
  });
});
