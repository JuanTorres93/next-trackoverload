import { beforeEach, describe, expect, it } from 'vitest';
import { GetDayNutritionalSummaryUsecase } from '../GetDayNutritionalSummary.usecase';
import { MemoryDaysRepo } from '@/infra/memory/MemoryDaysRepo';
import { Day } from '@/domain/entities/day/Day';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { NotFoundError, ValidationError } from '@/domain/common/errors';

describe('GetDayNutritionalSummaryUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let getDayNutritionalSummaryUsecase: GetDayNutritionalSummaryUsecase;

  beforeEach(() => {
    daysRepo = new MemoryDaysRepo();
    getDayNutritionalSummaryUsecase = new GetDayNutritionalSummaryUsecase(
      daysRepo
    );
  });

  it('should return nutritional summary for a day', async () => {
    const date = new Date('2023-10-01');
    const fakeMeal1 = FakeMeal.create({
      id: 'fake-meal-1',
      name: 'Breakfast',
      calories: 300,
      protein: 20,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const fakeMeal2 = FakeMeal.create({
      id: 'fake-meal-2',
      name: 'Lunch',
      calories: 500,
      protein: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const day = Day.create({
      id: date,
      meals: [fakeMeal1, fakeMeal2],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await daysRepo.saveDay(day);

    const result = await getDayNutritionalSummaryUsecase.execute({ date });

    expect(result).toEqual({
      date,
      totalCalories: 800,
      totalProtein: 50,
      mealsCount: 2,
    });
  });

  it('should return zero values for day with no meals', async () => {
    const date = new Date('2023-10-01');
    const day = Day.create({
      id: date,
      meals: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await daysRepo.saveDay(day);

    const result = await getDayNutritionalSummaryUsecase.execute({ date });

    expect(result).toEqual({
      date,
      totalCalories: 0,
      totalProtein: 0,
      mealsCount: 0,
    });
  });

  it('should throw error if date is invalid', async () => {
    const date = new Date('invalid');

    await expect(
      getDayNutritionalSummaryUsecase.execute({ date })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw error if day does not exist', async () => {
    const date = new Date('2023-10-01');

    await expect(
      getDayNutritionalSummaryUsecase.execute({ date })
    ).rejects.toThrow(NotFoundError);
  });
});
