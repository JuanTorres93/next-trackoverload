import { beforeEach, describe, expect, it } from 'vitest';
import { GetDayNutritionalSummaryUsecase } from '../GetDayNutritionalSummary.usecase';
import { MemoryDaysRepo } from '@/infra/memory/MemoryDaysRepo';
import { Day } from '@/domain/entities/day/Day';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';

describe('GetDayNutritionalSummaryUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let getDayNutritionalSummaryUsecase: GetDayNutritionalSummaryUsecase;
  const userId = 'user-1';

  beforeEach(() => {
    daysRepo = new MemoryDaysRepo();
    getDayNutritionalSummaryUsecase = new GetDayNutritionalSummaryUsecase(
      daysRepo
    );
  });

  it('should return nutritional summary for a day', async () => {
    const fakeMeal1 = FakeMeal.create({
      ...vp.validFakeMealProps,
    });
    const fakeMeal2 = FakeMeal.create({
      ...vp.validFakeMealProps,
      calories: 500,
      protein: 30,
      id: 'fake-meal-2',
    });
    const day = Day.create({
      ...vp.validDayProps,
      meals: [fakeMeal1, fakeMeal2],
    });

    await daysRepo.saveDay(day);

    const result = await getDayNutritionalSummaryUsecase.execute({
      date: vp.dateId,
      userId,
    });

    expect(result).toEqual({
      date: vp.dateId,
      totalCalories: vp.validFakeMealProps.calories + fakeMeal2.calories, // 200 + 500
      totalProtein: vp.validFakeMealProps.protein + fakeMeal2.protein, // 30 + 30
      mealsCount: 2,
    });
  });

  it('should return zero values for day with no meals', async () => {
    const day = Day.create({
      ...vp.validDayProps,
      meals: [],
    });

    await daysRepo.saveDay(day);

    const result = await getDayNutritionalSummaryUsecase.execute({
      date: vp.dateId,
      userId,
    });

    expect(result).toEqual({
      date: vp.dateId,
      totalCalories: 0,
      totalProtein: 0,
      mealsCount: 0,
    });
  });

  it('should throw error if date is invalid', async () => {
    const invalidDates = [
      new Date('invalid-date'),
      new Date(''),
      new Date('2023-13-01'),
      2,
      null,
      undefined,
      {},
      '',
      [],
      NaN,
    ];

    for (const date of invalidDates) {
      await expect(
        // @ts-expect-error testing invalid inputs
        getDayNutritionalSummaryUsecase.execute({ date, userId })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw error if day does not exist', async () => {
    const date = new Date('2023-10-01');

    await expect(
      getDayNutritionalSummaryUsecase.execute({ date, userId })
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw error if userId is invalid', async () => {
    const invalidUserIds = [
      '',
      '   ',
      null,
      undefined,
      123,
      {},
      [],
      true,
      false,
    ];

    for (const userId of invalidUserIds) {
      await expect(
        // @ts-expect-error testing invalid inputs
        getDayNutritionalSummaryUsecase.execute({ date: vp.dateId, userId })
      ).rejects.toThrow(ValidationError);
    }
  });
});
