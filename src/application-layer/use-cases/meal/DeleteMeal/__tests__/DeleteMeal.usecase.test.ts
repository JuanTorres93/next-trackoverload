import * as vp from '@/../tests/createProps';
import {
  AuthError,
  NotFoundError,
  ValidationError,
} from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Meal } from '@/domain/entities/meal/Meal';
import { MemoryMealsRepo } from '@/infra/memory/MemoryMealsRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { DeleteMealUsecase } from '../DeleteMeal.usecase';

describe('DeleteMealUsecase', () => {
  let mealsRepo: MemoryMealsRepo;
  let deleteMealUsecase: DeleteMealUsecase;

  beforeEach(() => {
    mealsRepo = new MemoryMealsRepo();
    deleteMealUsecase = new DeleteMealUsecase(mealsRepo);
  });

  it('should delete existing meal', async () => {
    const ingredient = Ingredient.create({
      ...vp.validIngredientProps,
    });

    const ingredientLine = IngredientLine.create({
      ...vp.ingredientLinePropsNoIngredient,
      ingredient,
    });

    const meal = Meal.create({
      ...vp.mealPropsNoIngredientLines,
      ingredientLines: [ingredientLine],
    });

    await mealsRepo.saveMeal(meal);

    await deleteMealUsecase.execute({
      id: vp.mealPropsNoIngredientLines.id,
      userId: vp.userId,
    });

    const deletedMeal = await mealsRepo.getMealById(
      vp.mealPropsNoIngredientLines.id
    );
    expect(deletedMeal).toBeNull();
  });

  it('should throw NotFoundError when meal does not exist', async () => {
    await expect(
      deleteMealUsecase.execute({ id: 'non-existent', userId: vp.userId })
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw error when id is invalid', async () => {
    const invalidIds = [true, 4, null, undefined, ''];

    for (const invalidId of invalidIds) {
      await expect(
        // @ts-expect-error Testing invalid inputs
        deleteMealUsecase.execute({ id: invalidId })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw error when userId is invalid', async () => {
    const invalidUserIds = [true, 4, null, undefined, ''];

    for (const invalidUserId of invalidUserIds) {
      await expect(
        // @ts-expect-error Testing invalid inputs
        deleteMealUsecase.execute({ id: '1', userId: invalidUserId })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw error when trying to delete a meal that does not belong to the user', async () => {
    const ingredient = Ingredient.create({
      ...vp.validIngredientProps,
    });

    const ingredientLine = IngredientLine.create({
      ...vp.ingredientLinePropsNoIngredient,
      ingredient,
    });

    const meal = Meal.create({
      ...vp.mealPropsNoIngredientLines,
      ingredientLines: [ingredientLine],
    });

    await mealsRepo.saveMeal(meal);

    await expect(
      deleteMealUsecase.execute({
        id: vp.mealPropsNoIngredientLines.id,
        userId: 'another-user-id',
      })
    ).rejects.toThrow(AuthError);
  });
});
