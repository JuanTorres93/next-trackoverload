import { beforeEach, describe, expect, it } from 'vitest';
import { GetMealsByIdsUsecase } from '../GetMealsByIds.usecase';
import { MemoryMealsRepo } from '@/infra/memory/MemoryMealsRepo';
import { Meal } from '@/domain/entities/meal/Meal';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { ValidationError } from '@/domain/common/errors';
import { v4 as uuidv4 } from 'uuid';

describe('GetMealsByIdsUsecase', () => {
  let mealsRepo: MemoryMealsRepo;
  let getMealsByIdsUsecase: GetMealsByIdsUsecase;
  let testMeals: Meal[];

  beforeEach(() => {
    mealsRepo = new MemoryMealsRepo();
    getMealsByIdsUsecase = new GetMealsByIdsUsecase(mealsRepo);

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

    testMeals = [
      Meal.create({
        id: uuidv4(),
        name: 'Grilled Chicken Meal',
        ingredientLines: [testIngredientLine],
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      Meal.create({
        id: uuidv4(),
        name: 'Chicken Salad Meal',
        ingredientLines: [testIngredientLine],
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      Meal.create({
        id: uuidv4(),
        name: 'Protein Bowl',
        ingredientLines: [testIngredientLine],
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];
  });

  it('should return meals for valid ids', async () => {
    // Save meals to repo
    await Promise.all(testMeals.map((meal) => mealsRepo.saveMeal(meal)));

    const ids = [testMeals[0].id, testMeals[1].id];
    const result = await getMealsByIdsUsecase.execute({ ids });

    expect(result).toHaveLength(2);
    expect(result).toContain(testMeals[0]);
    expect(result).toContain(testMeals[1]);
  });

  it('should return only found meals when some ids do not exist', async () => {
    // Save only first meal
    await mealsRepo.saveMeal(testMeals[0]);

    const ids = [testMeals[0].id, 'non-existent-id'];
    const result = await getMealsByIdsUsecase.execute({ ids });

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(testMeals[0]);
  });

  it('should return empty array when no meals are found', async () => {
    const ids = ['non-existent-1', 'non-existent-2'];
    const result = await getMealsByIdsUsecase.execute({ ids });

    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
  });

  it('should handle duplicate ids by returning unique meals', async () => {
    await mealsRepo.saveMeal(testMeals[0]);

    const ids = [testMeals[0].id, testMeals[0].id, testMeals[0].id];
    const result = await getMealsByIdsUsecase.execute({ ids });

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(testMeals[0]);
  });

  it('should throw error when ids is not an array', async () => {
    await expect(
      // @ts-expect-error Testing invalid input
      getMealsByIdsUsecase.execute({ ids: 'not-an-array' })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw error when ids array is empty', async () => {
    await expect(getMealsByIdsUsecase.execute({ ids: [] })).rejects.toThrow(
      ValidationError
    );
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
});
