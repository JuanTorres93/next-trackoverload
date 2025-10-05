import { beforeEach, describe, expect, it } from 'vitest';
import { RemoveMealFromDayUsecase } from '../RemoveMealFromDay.usecase';
import { MemoryDaysRepo } from '@/infra/memory/MemoryDaysRepo';
import { Day } from '@/domain/entities/day/Day';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { ValidationError } from '@/domain/common/errors';

describe('RemoveMealFromDayUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let removeMealFromDayUsecase: RemoveMealFromDayUsecase;

  beforeEach(() => {
    daysRepo = new MemoryDaysRepo();
    removeMealFromDayUsecase = new RemoveMealFromDayUsecase(daysRepo);
  });

  it('should remove meal from day', async () => {
    const date = new Date('2023-10-01');
    const fakeMeal = FakeMeal.create({
      id: 'fake-meal-1',
      name: 'Quick Snack',
      calories: 200,
      protein: 10,
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

    const result = await removeMealFromDayUsecase.execute({
      date,
      mealId: 'fake-meal-1',
    });

    expect(result.meals).toHaveLength(0);
  });

  it('should throw error if day does not exist', async () => {
    const date = new Date('2023-10-01');

    await expect(
      removeMealFromDayUsecase.execute({ date, mealId: 'fake-meal-1' })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw error if meal does not exist in day', async () => {
    const date = new Date('2023-10-01');
    const day = Day.create({
      id: date,
      meals: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await daysRepo.saveDay(day);

    await expect(
      removeMealFromDayUsecase.execute({ date, mealId: 'non-existent' })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw error if mealId is invalid', async () => {
    const date = new Date('2023-10-01');
    const invalidMealIds = ['', '   ', null];

    for (const mealId of invalidMealIds) {
      await expect(
        removeMealFromDayUsecase.execute({ date, mealId: mealId as string })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw error if date is invalid', async () => {
    const invalidDates = [null, undefined, new Date('invalid-date')];

    for (const date of invalidDates) {
      await expect(
        // @ts-expect-error testing invalid dates
        removeMealFromDayUsecase.execute({ date, mealId: 'fake-meal-1' })
      ).rejects.toThrow(ValidationError);
    }
  });
});
