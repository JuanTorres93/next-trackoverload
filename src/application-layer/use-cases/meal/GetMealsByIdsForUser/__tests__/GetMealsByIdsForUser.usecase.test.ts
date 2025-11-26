import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { ValidationError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Meal } from '@/domain/entities/meal/Meal';
import { MemoryMealsRepo } from '@/infra/memory/MemoryMealsRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { Id } from '@/domain/types/Id/Id';
import { GetMealsByIdsForUserUsecase } from '../GetMealsByIdsForUser.usecase';

describe('GetMealsByIdsUsecase', () => {
  let mealsRepo: MemoryMealsRepo;
  let getMealsByIdsUsecase: GetMealsByIdsForUserUsecase;
  let testMeals: Meal[];

  beforeEach(() => {
    mealsRepo = new MemoryMealsRepo();
    getMealsByIdsUsecase = new GetMealsByIdsForUserUsecase(mealsRepo);

    const testIngredient = Ingredient.create({
      ...vp.validIngredientProps,
    });

    const testIngredientLine = IngredientLine.create({
      ...vp.ingredientLinePropsNoIngredient,
      ingredient: testIngredient,
    });

    testMeals = [
      Meal.create({
        ...vp.mealPropsNoIngredientLines,
        id: Id.create('meal-1'),
        ingredientLines: [testIngredientLine],
      }),
      Meal.create({
        ...vp.mealPropsNoIngredientLines,
        id: Id.create('meal-2'),
        ingredientLines: [testIngredientLine],
      }),
      Meal.create({
        ...vp.mealPropsNoIngredientLines,
        id: Id.create('meal-3'),
        ingredientLines: [testIngredientLine],
      }),
    ];
  });

  it('should return meals for valid ids', async () => {
    // Save meals to repo
    await Promise.all(testMeals.map((meal) => mealsRepo.saveMeal(meal)));

    const ids = [testMeals[0].id, testMeals[1].id];
    const result = await getMealsByIdsUsecase.execute({
      ids,
      userId: vp.userId,
    });

    const resultIds = result.map((m) => m.id);

    expect(result).toHaveLength(2);
    expect(resultIds).toContain(testMeals[0].id);
    expect(resultIds).toContain(testMeals[1].id);
  });

  it('should return only found meals when some ids do not exist', async () => {
    // Save only first meal
    await mealsRepo.saveMeal(testMeals[0]);

    const ids = [testMeals[0].id, 'non-existent-id'];
    const result = await getMealsByIdsUsecase.execute({
      ids,
      userId: vp.userId,
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(testMeals[0].id);
  });

  it('should return an array of MealDTO', async () => {
    // Save meals to repo
    await Promise.all(testMeals.map((meal) => mealsRepo.saveMeal(meal)));

    const ids = [testMeals[0].id, testMeals[1].id];
    const result = await getMealsByIdsUsecase.execute({
      ids,
      userId: vp.userId,
    });

    expect(result).toHaveLength(2);

    for (const meal of result) {
      expect(meal).not.toBeInstanceOf(Meal);

      for (const prop of dto.mealDTOProperties) {
        expect(meal).toHaveProperty(prop);
      }
    }
  });

  it('should return empty array when no meals are found', async () => {
    const ids = ['non-existent-1', 'non-existent-2'];
    const result = await getMealsByIdsUsecase.execute({
      ids,
      userId: vp.userId,
    });

    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
  });

  it('should handle duplicate ids by returning unique meals', async () => {
    await mealsRepo.saveMeal(testMeals[0]);

    const ids = [testMeals[0].id, testMeals[0].id, testMeals[0].id];
    const result = await getMealsByIdsUsecase.execute({
      ids,
      userId: vp.userId,
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(testMeals[0].id);
  });

  it('should throw error when ids is not an array', async () => {
    await expect(
      // @ts-expect-error Testing invalid input
      getMealsByIdsUsecase.execute({ ids: 'not-an-array' })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw error when ids array is empty', async () => {
    await expect(
      getMealsByIdsUsecase.execute({ ids: [], userId: vp.userId })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw error when any id is invalid', async () => {
    const invalidIds = [
      ['', 'valid-id'],
      ['valid-id', null],
      ['valid-id', undefined],
    ];

    for (const ids of invalidIds) {
      await expect(
        // @ts-expect-error Testing invalid inputs
        getMealsByIdsUsecase.execute({ ids })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw error if userId is invalid', async () => {
    const invalidUserIds = ['', null, undefined, '   ', 123, {}, [], true];

    for (const userId of invalidUserIds) {
      await expect(
        // @ts-expect-error Testing invalid inputs
        getMealsByIdsUsecase.execute({ ids: ['meal-1'], userId })
      ).rejects.toThrow(ValidationError);
    }
  });
});
