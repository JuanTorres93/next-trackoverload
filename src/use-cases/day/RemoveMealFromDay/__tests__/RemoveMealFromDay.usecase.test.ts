import { beforeEach, describe, expect, it } from 'vitest';
import { RemoveMealFromDayUsecase } from '../RemoveMealFromDay.usecase';
import { MemoryDaysRepo } from '@/infra/memory/MemoryDaysRepo';
import { Day } from '@/domain/entities/day/Day';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { ValidationError } from '@/domain/common/errors';

import * as vp from '@/../tests/createProps';

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
      ...vp.validFakeMealProps,
    });
    const day = Day.create({
      ...vp.validDayProps,
      meals: [fakeMeal],
    });

    await daysRepo.saveDay(day);

    const result = await removeMealFromDayUsecase.execute({
      date,
      userId: vp.userId,
      mealId: vp.validFakeMealProps.id,
    });

    expect(result.meals).toHaveLength(0);
  });

  it('should throw error if day does not exist', async () => {
    const date = new Date('2023-10-01');

    await expect(
      removeMealFromDayUsecase.execute({
        date,
        userId: vp.userId,
        mealId: vp.validFakeMealProps.id,
      })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw error if meal does not exist in day', async () => {
    const day = Day.create({
      ...vp.validDayProps,
      meals: [],
    });

    await daysRepo.saveDay(day);

    await expect(
      removeMealFromDayUsecase.execute({
        date: vp.dateId,
        userId: vp.userId,
        mealId: 'non-existent',
      })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw error if mealId is invalid', async () => {
    const invalidMealIds = ['', '   ', null, 3, undefined, {}, [], true];

    for (const mealId of invalidMealIds) {
      await expect(
        removeMealFromDayUsecase.execute({
          date: vp.dateId,
          userId: vp.userId,
          mealId: mealId as string,
        })
      ).rejects.toThrow(ValidationError);
    }
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
    ];

    for (const date of invalidDates) {
      await expect(
        removeMealFromDayUsecase.execute({
          // @ts-expect-error testing invalid dates
          date,
          userId: vp.userId,
          mealId: 'fake-meal-1',
        })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw error if userId is invalid', async () => {
    const invalidUserIds = ['', '   ', null, 3, undefined, {}, [], true];

    for (const userId of invalidUserIds) {
      await expect(
        removeMealFromDayUsecase.execute({
          date: vp.dateId,
          // @ts-expect-error testing invalid userIds
          userId,
          mealId: 'fake-meal-1',
        })
      ).rejects.toThrow(ValidationError);
    }
  });
});
