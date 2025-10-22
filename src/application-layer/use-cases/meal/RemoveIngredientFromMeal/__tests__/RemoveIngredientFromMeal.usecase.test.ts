import { beforeEach, describe, expect, it } from 'vitest';
import { RemoveIngredientFromMealUsecase } from '../RemoveIngredientFromMeal.usecase';
import { MemoryMealsRepo } from '@/infra/memory/MemoryMealsRepo';
import { Meal } from '@/domain/entities/meal/Meal';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import {
  ValidationError,
  NotFoundError,
  AuthError,
} from '@/domain/common/errors';
import { v4 as uuidv4 } from 'uuid';
import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';

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
      id: uuidv4(),
    });

    const firstIngredientLine = IngredientLine.create({
      ...vp.ingredientLinePropsNoIngredient,
      ingredient: testIngredient,
    });

    const secondIngredientLine = IngredientLine.create({
      ...vp.ingredientLinePropsNoIngredient,
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
      id: uuidv4(),
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

  it('should throw error when userId is invalid', async () => {
    const invalidUserIds = [null, undefined, 3, '', true, {}];

    for (const invalidUserId of invalidUserIds) {
      await expect(
        removeIngredientFromMealUsecase.execute({
          mealId: testMeal.id,
          ingredientId: testIngredient.id,
          // @ts-expect-error Testing invalid inputs
          userId: invalidUserId,
        })
      ).rejects.toThrow(ValidationError);
    }
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
