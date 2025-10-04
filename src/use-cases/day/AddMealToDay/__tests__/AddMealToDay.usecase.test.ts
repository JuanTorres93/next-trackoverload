import { beforeEach, describe, expect, it } from 'vitest';
import { AddMealToDayUsecase } from '../AddMealToDay.usecase';
import { MemoryDaysRepo } from '@/infra/memory/MemoryDaysRepo';
import { MemoryMealsRepo } from '@/infra/memory/MemoryMealsRepo';
import { Day } from '@/domain/entities/day/Day';
import { Meal } from '@/domain/entities/meal/Meal';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { ValidationError } from '@/domain/common/errors';

describe('AddMealToDayUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let mealsRepo: MemoryMealsRepo;
  let addMealToDayUsecase: AddMealToDayUsecase;

  beforeEach(() => {
    daysRepo = new MemoryDaysRepo();
    mealsRepo = new MemoryMealsRepo();
    addMealToDayUsecase = new AddMealToDayUsecase(daysRepo, mealsRepo);
  });

  it('should add meal to existing day', async () => {
    const date = new Date('2023-10-01');
    const day = Day.create({
      id: date,
      meals: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const ingredient = Ingredient.create({
      id: 'ingredient-1',
      name: 'Chicken',
      nutritionalInfoPer100g: { calories: 200, protein: 25 },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const ingredientLine = IngredientLine.create({
      id: 'line-1',
      ingredient,
      quantityInGrams: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const meal = Meal.create({
      id: 'meal-1',
      name: 'Breakfast',
      ingredientLines: [ingredientLine],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await daysRepo.saveDay(day);
    await mealsRepo.saveMeal(meal);

    const result = await addMealToDayUsecase.execute({
      date,
      mealId: 'meal-1',
    });

    expect(result.meals).toHaveLength(1);
    expect(result.meals[0]).toEqual(meal);
  });

  it('should create new day and add meal if day does not exist', async () => {
    const date = new Date('2023-10-01');
    const ingredient = Ingredient.create({
      id: 'ingredient-1',
      name: 'Chicken',
      nutritionalInfoPer100g: { calories: 200, protein: 25 },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const ingredientLine = IngredientLine.create({
      id: 'line-1',
      ingredient,
      quantityInGrams: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const meal = Meal.create({
      id: 'meal-1',
      name: 'Breakfast',
      ingredientLines: [ingredientLine],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await mealsRepo.saveMeal(meal);

    const result = await addMealToDayUsecase.execute({
      date,
      mealId: 'meal-1',
    });

    expect(result.id).toEqual(date);
    expect(result.meals).toHaveLength(1);
    expect(result.meals[0]).toEqual(meal);
  });

  it('should throw error if meal does not exist', async () => {
    const date = new Date('2023-10-01');

    await expect(
      addMealToDayUsecase.execute({ date, mealId: 'non-existent' })
    ).rejects.toThrow(ValidationError);
  });
});
