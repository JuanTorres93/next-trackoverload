import { beforeEach, describe, expect, it } from 'vitest';
import { GetMealByIdUsecase } from '../GetMealById.usecase';
import { MemoryMealsRepo } from '@/infra/memory/MemoryMealsRepo';
import { Meal } from '@/domain/entities/meal/Meal';
import { ValidationError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';

describe('GetMealByIdUsecase', () => {
  let mealsRepo: MemoryMealsRepo;
  let getMealByIdUsecase: GetMealByIdUsecase;

  beforeEach(() => {
    mealsRepo = new MemoryMealsRepo();
    getMealByIdUsecase = new GetMealByIdUsecase(mealsRepo);
  });

  it('should return meal when found', async () => {
    const ingredient = Ingredient.create({
      id: '1',
      name: 'Chicken Breast',
      nutritionalInfoPer100g: {
        calories: 165,
        protein: 31,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const ingredientLine = IngredientLine.create({
      id: '1',
      ingredient,
      quantityInGrams: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const meal = Meal.create({
      id: '1',
      name: 'Protein Meal',
      ingredientLines: [ingredientLine],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await mealsRepo.saveMeal(meal);

    const result = await getMealByIdUsecase.execute({ id: '1' });

    expect(result).toEqual(meal);
  });

  it('should return null when meal not found', async () => {
    const result = await getMealByIdUsecase.execute({
      id: 'non-existent',
    });

    expect(result).toBeNull();
  });

  it('should throw error when id is invalid', async () => {
    const invalidIds = [true, 4, null, undefined, ''];

    for (const invalidId of invalidIds) {
      await expect(
        // @ts-expect-error Testing invalid inputs
        getMealByIdUsecase.execute({ id: invalidId })
      ).rejects.toThrow(ValidationError);
    }
  });
});
