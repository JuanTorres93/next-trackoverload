import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateDayMealsUsecase } from '../UpdateDayMeals.usecase';
import { MemoryDaysRepo } from '@/infra/memory/MemoryDaysRepo';
import { Day } from '@/domain/entities/day/Day';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { Meal } from '@/domain/entities/meal/Meal';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Id } from '@/domain/types/Id/Id';
import { ValidationError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';

describe('UpdateDayMealsUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let updateDayMealsUsecase: UpdateDayMealsUsecase;

  beforeEach(() => {
    daysRepo = new MemoryDaysRepo();
    updateDayMealsUsecase = new UpdateDayMealsUsecase(daysRepo);
  });

  it('should update meals for existing day', async () => {
    const oldFakeMeal = FakeMeal.create({
      ...vp.validFakeMealProps,
    });
    const day = Day.create({
      ...vp.validDayProps,
      meals: [oldFakeMeal],
    });

    await daysRepo.saveDay(day);

    const newFakeMeal = FakeMeal.create({
      ...vp.validFakeMealProps,
      id: Id.create('new-fake-meal'),
      calories: 200,
      protein: 10,
    });
    const ingredient = Ingredient.create({
      ...vp.validIngredientProps,
      nutritionalInfoPer100g: { calories: 150, protein: 3 },
    });
    const ingredientLine = IngredientLine.create({
      ...vp.ingredientLinePropsNoIngredient,
      ingredient,
    });
    const newMeal = Meal.create({
      ...vp.mealPropsNoIngredientLines,
      ingredientLines: [ingredientLine],
    });

    const result = await updateDayMealsUsecase.execute({
      date: vp.dateId,
      userId: vp.userId,
      meals: [newFakeMeal, newMeal],
    });

    const mealsIds = result.meals.map((meal) => meal.id);

    expect(result.meals).toHaveLength(2);
    expect(mealsIds).toContain(newFakeMeal.id);
    expect(mealsIds).toContain(newMeal.id);
    expect(mealsIds).not.toContain(oldFakeMeal.id);
    expect(result.calories).toBe(500); // 200 from fakeMeal + 300 from meal (150*2)
    expect(result.protein).toBe(16); // 10 from fakeMeal + 6 from meal (3*2)
  });

  it('should return a DayDTO', async () => {
    const date = new Date('2023-10-01');
    const fakeMeal = FakeMeal.create({
      ...vp.validFakeMealProps,
    });
    const day = Day.create({
      ...vp.validDayProps,
      meals: [fakeMeal],
    });

    await daysRepo.saveDay(day);

    const result = await updateDayMealsUsecase.execute({
      date,
      userId: vp.userId,
      meals: [fakeMeal],
    });

    expect(result).not.toBeInstanceOf(Day);
    for (const prop of dto.dayDTOProperties) {
      expect(result).toHaveProperty(prop);
    }
  });

  it('should create new day if it does not exist', async () => {
    const nonExistentDate = new Date('2023-10-11');
    const fakeMeal = FakeMeal.create({
      ...vp.validFakeMealProps,
    });

    const result = await updateDayMealsUsecase.execute({
      date: nonExistentDate,
      userId: vp.userId,
      meals: [fakeMeal],
    });

    expect(result.id).toEqual(nonExistentDate.toISOString());
    expect(result.meals).toHaveLength(1);
    expect(result.meals[0].id).toEqual(fakeMeal.id);
  });

  it('should handle empty meals array', async () => {
    const date = new Date('2023-10-01');
    const fakeMeal = FakeMeal.create({
      ...vp.validFakeMealProps,
    });
    const day = Day.create({
      ...vp.validDayProps,
      meals: [fakeMeal],
    });

    await daysRepo.saveDay(day);

    const result = await updateDayMealsUsecase.execute({
      date,
      userId: vp.userId,
      meals: [],
    });

    expect(result.meals).toHaveLength(0);
    expect(result.calories).toBe(0);
    expect(result.protein).toBe(0);
  });

  it('should preserve createdAt but update updatedAt', async () => {
    const originalCreatedAt = new Date('2023-09-01');
    const day = Day.create({
      ...vp.validDayProps,
      createdAt: originalCreatedAt,
      updatedAt: originalCreatedAt,
    });

    await daysRepo.saveDay(day);

    const result = await updateDayMealsUsecase.execute({
      date: vp.dateId,
      userId: vp.userId,
      meals: [],
    });

    expect(result.createdAt).toEqual(originalCreatedAt.toISOString());
    expect(new Date(result.updatedAt).getTime()).toBeGreaterThan(
      originalCreatedAt.getTime()
    );
  });

  it('should throw error if date is invalid', async () => {
    const invalidDates = [
      null,
      undefined,
      new Date('invalid-date'),
      123,
      '2023-10-01',
      {},
      [],
      true,
      NaN,
    ];

    for (const date of invalidDates) {
      await expect(
        // @ts-expect-error testing invalid dates
        updateDayMealsUsecase.execute({ date, meals: [] })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw error if userId is invalid', async () => {
    const invalidUserIds = ['', '   ', null, 3, undefined, {}, [], true];

    for (const userId of invalidUserIds) {
      await expect(
        updateDayMealsUsecase.execute({
          date: vp.dateId,
          userId: userId as string,
          meals: [],
        })
      ).rejects.toThrow(ValidationError);
    }
  });
});
