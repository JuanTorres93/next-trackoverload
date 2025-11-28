import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Meal } from '@/domain/entities/meal/Meal';
import { MemoryMealsRepo } from '@/infra/memory/MemoryMealsRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateMealUsecase } from '../UpdateMeal.usecase';

describe('UpdateMealUsecase', () => {
  let mealsRepo: MemoryMealsRepo;
  let updateMealUsecase: UpdateMealUsecase;

  beforeEach(() => {
    mealsRepo = new MemoryMealsRepo();
    updateMealUsecase = new UpdateMealUsecase(mealsRepo);
  });

  it('should update meal name', async () => {
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

    const updatedMeal = await updateMealUsecase.execute({
      id: vp.mealPropsNoIngredientLines.id,
      userId: vp.userId,
      name: 'High Protein Meal',
    });

    expect(updatedMeal.name).toBe('High Protein Meal');
    expect(updatedMeal.id).toBe(vp.mealPropsNoIngredientLines.id);
    expect(updatedMeal.ingredientLines).toHaveLength(1);
    expect(updatedMeal.createdAt).toBe(meal.createdAt.toISOString());
    expect(updatedMeal.updatedAt).not.toBe(meal.updatedAt.toISOString());
  });

  it('should return same meal when no changes are made', async () => {
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

    const result = await updateMealUsecase.execute({
      id: vp.mealPropsNoIngredientLines.id,
      userId: vp.userId,
    });

    expect(result.id).toBe(meal.id);
    expect(result.name).toBe(meal.name);
  });

  it('should return MealDTO', async () => {
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

    const result = await updateMealUsecase.execute({
      id: vp.mealPropsNoIngredientLines.id,
      userId: vp.userId,
      name: 'Updated Meal Name',
    });

    expect(result).not.toBeInstanceOf(Meal);

    for (const prop of dto.mealDTOProperties) {
      expect(result).toHaveProperty(prop);
    }
  });

  it('should throw NotFoundError when meal does not exist', async () => {
    await expect(
      updateMealUsecase.execute({
        id: 'non-existent',
        userId: vp.userId,
        name: 'New Name',
      })
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw ValidationError when id is invalid', async () => {
    const invalidIds = ['', null, undefined];

    for (const invalidId of invalidIds) {
      await expect(
        // @ts-expect-error Testing invalid inputs
        updateMealUsecase.execute({ id: invalidId, name: 'Valid Name' })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw ValidationError when name is invalid', async () => {
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

    const invalidNames = [null, 3, true, {}, []];

    for (const invalidName of invalidNames) {
      await expect(
        updateMealUsecase.execute({
          id: vp.mealPropsNoIngredientLines.id,
          // @ts-expect-error Testing invalid inputs
          name: invalidName,
        })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw error if userId is invalid', async () => {
    const invalidUserIds = [
      '',
      null,
      undefined,
      123,
      true,
      {},
      [],
      () => {},
      NaN,
    ];

    for (const invalidUserId of invalidUserIds) {
      await expect(
        // @ts-expect-error Testing invalid inputs
        updateMealUsecase.execute({ id: '1', userId: invalidUserId })
      ).rejects.toThrow(ValidationError);
    }
  });
});
