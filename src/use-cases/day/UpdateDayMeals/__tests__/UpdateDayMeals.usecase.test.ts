import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateDayMealsUsecase } from '../UpdateDayMeals.usecase';
import { MemoryDaysRepo } from '@/infra/memory/MemoryDaysRepo';
import { Day } from '@/domain/entities/day/Day';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { Meal } from '@/domain/entities/meal/Meal';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { ValidationError } from '@/domain/common/errors';

describe('UpdateDayMealsUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let updateDayMealsUsecase: UpdateDayMealsUsecase;

  beforeEach(() => {
    daysRepo = new MemoryDaysRepo();
    updateDayMealsUsecase = new UpdateDayMealsUsecase(daysRepo);
  });

  it('should update meals for existing day', async () => {
    const date = new Date('2023-10-01');
    const oldFakeMeal = FakeMeal.create({
      id: 'old-fake-meal',
      name: 'Old Snack',
      calories: 100,
      protein: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const day = Day.create({
      id: date,
      meals: [oldFakeMeal],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await daysRepo.saveDay(day);

    const newFakeMeal = FakeMeal.create({
      id: 'new-fake-meal',
      name: 'New Snack',
      calories: 200,
      protein: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const ingredient = Ingredient.create({
      id: 'ingredient-1',
      name: 'Rice',
      nutritionalInfoPer100g: { calories: 150, protein: 3 },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const ingredientLine = IngredientLine.create({
      id: 'line-1',
      ingredient,
      quantityInGrams: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const newMeal = Meal.create({
      id: 'new-meal',
      name: 'New Meal',
      ingredientLines: [ingredientLine],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await updateDayMealsUsecase.execute({
      date,
      meals: [newFakeMeal, newMeal],
    });

    expect(result.meals).toHaveLength(2);
    expect(result.meals).toContain(newFakeMeal);
    expect(result.meals).toContain(newMeal);
    expect(result.meals).not.toContain(oldFakeMeal);
    expect(result.calories).toBe(500); // 200 from fakeMeal + 300 from meal (150*2)
    expect(result.protein).toBe(16); // 10 from fakeMeal + 6 from meal (3*2)
  });

  it('should create new day if it does not exist', async () => {
    const date = new Date('2023-10-01');
    const fakeMeal = FakeMeal.create({
      id: 'fake-meal',
      name: 'Snack',
      calories: 150,
      protein: 8,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await updateDayMealsUsecase.execute({
      date,
      meals: [fakeMeal],
    });

    expect(result.id).toEqual(date);
    expect(result.meals).toHaveLength(1);
    expect(result.meals[0]).toEqual(fakeMeal);
  });

  it('should handle empty meals array', async () => {
    const date = new Date('2023-10-01');
    const fakeMeal = FakeMeal.create({
      id: 'fake-meal',
      name: 'Snack',
      calories: 150,
      protein: 8,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const day = Day.create({
      id: date,
      meals: [fakeMeal],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await daysRepo.saveDay(day);

    const result = await updateDayMealsUsecase.execute({
      date,
      meals: [],
    });

    expect(result.meals).toHaveLength(0);
    expect(result.calories).toBe(0);
    expect(result.protein).toBe(0);
  });

  it('should preserve createdAt but update updatedAt', async () => {
    const date = new Date('2023-10-01');
    const originalCreatedAt = new Date('2023-09-01');
    const day = Day.create({
      id: date,
      meals: [],
      createdAt: originalCreatedAt,
      updatedAt: new Date('2023-09-01'),
    });

    await daysRepo.saveDay(day);

    const result = await updateDayMealsUsecase.execute({
      date,
      meals: [],
    });

    expect(result.createdAt).toEqual(originalCreatedAt);
    expect(result.updatedAt.getTime()).toBeGreaterThan(
      originalCreatedAt.getTime()
    );
  });

  it('should throw error if date is invalid', async () => {
    const invalidDates = [null, undefined, new Date('invalid-date')];

    for (const date of invalidDates) {
      await expect(
        // @ts-expect-error testing invalid dates
        updateDayMealsUsecase.execute({ date, meals: [] })
      ).rejects.toThrow(ValidationError);
    }
  });
});
