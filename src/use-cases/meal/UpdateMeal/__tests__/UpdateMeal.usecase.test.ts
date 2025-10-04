import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateMealUsecase } from '../UpdateMeal.usecase';
import { MemoryMealsRepo } from '@/infra/memory/MemoryMealsRepo';
import { Meal } from '@/domain/entities/meal/Meal';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';

describe('UpdateMealUsecase', () => {
  let mealsRepo: MemoryMealsRepo;
  let updateMealUsecase: UpdateMealUsecase;

  beforeEach(() => {
    mealsRepo = new MemoryMealsRepo();
    updateMealUsecase = new UpdateMealUsecase(mealsRepo);
  });

  it('should update meal name', async () => {
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
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    });

    await mealsRepo.saveMeal(meal);

    const updatedMeal = await updateMealUsecase.execute({
      id: '1',
      name: 'High Protein Meal',
    });

    expect(updatedMeal.name).toBe('High Protein Meal');
    expect(updatedMeal.id).toBe('1');
    expect(updatedMeal.ingredientLines).toHaveLength(1);
    expect(updatedMeal.createdAt).toEqual(meal.createdAt);
    expect(updatedMeal.updatedAt).not.toEqual(meal.updatedAt);
  });

  it('should return same meal when no changes are made', async () => {
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
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    });

    await mealsRepo.saveMeal(meal);

    const result = await updateMealUsecase.execute({
      id: '1',
    });

    expect(result).toEqual(meal);
  });

  it('should throw NotFoundError when meal does not exist', async () => {
    await expect(
      updateMealUsecase.execute({
        id: 'non-existent',
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

    const invalidNames = [null, 3, true, {}, []];

    for (const invalidName of invalidNames) {
      await expect(
        // @ts-expect-error Testing invalid inputs
        updateMealUsecase.execute({ id: '1', name: invalidName })
      ).rejects.toThrow(ValidationError);
    }
  });
});
