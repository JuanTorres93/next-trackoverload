import { beforeEach, describe, expect, it } from 'vitest';
import { GetAllMealsUsecase } from '../GetAllMeals.usecase';
import { MemoryMealsRepo } from '@/infra/memory/MemoryMealsRepo';
import { Meal } from '@/domain/entities/meal/Meal';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';

describe('GetAllMealsUsecase', () => {
  let mealsRepo: MemoryMealsRepo;
  let getAllMealsUsecase: GetAllMealsUsecase;

  beforeEach(() => {
    mealsRepo = new MemoryMealsRepo();
    getAllMealsUsecase = new GetAllMealsUsecase(mealsRepo);
  });

  it('should return all meals', async () => {
    const ingredient1 = Ingredient.create({
      id: '1',
      name: 'Chicken Breast',
      nutritionalInfoPer100g: {
        calories: 165,
        protein: 31,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const ingredient2 = Ingredient.create({
      id: '2',
      name: 'Rice',
      nutritionalInfoPer100g: {
        calories: 130,
        protein: 2.7,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const ingredientLine1 = IngredientLine.create({
      id: '1',
      ingredient: ingredient1,
      quantityInGrams: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const ingredientLine2 = IngredientLine.create({
      id: '2',
      ingredient: ingredient2,
      quantityInGrams: 150,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const meal1 = Meal.create({
      id: '1',
      name: 'Protein Meal',
      ingredientLines: [ingredientLine1],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const meal2 = Meal.create({
      id: '2',
      name: 'Carb Meal',
      ingredientLines: [ingredientLine2],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await mealsRepo.saveMeal(meal1);
    await mealsRepo.saveMeal(meal2);

    const meals = await getAllMealsUsecase.execute();

    expect(meals).toHaveLength(2);
    expect(meals).toContain(meal1);
    expect(meals).toContain(meal2);
  });

  it('should return empty array when no meals exist', async () => {
    const meals = await getAllMealsUsecase.execute();

    expect(meals).toHaveLength(0);
    expect(meals).toEqual([]);
  });
});
