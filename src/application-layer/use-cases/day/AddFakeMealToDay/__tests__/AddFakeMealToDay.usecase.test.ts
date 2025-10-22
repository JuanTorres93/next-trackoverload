import { beforeEach, describe, expect, it } from 'vitest';
import { AddFakeMealToDayUsecase } from '../AddFakeMealToDay.usecase';
import { MemoryDaysRepo } from '@/infra/memory/MemoryDaysRepo';
import { MemoryFakeMealsRepo } from '@/infra/memory/MemoryFakeMealsRepo';
import { Day } from '@/domain/entities/day/Day';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { ValidationError } from '@/domain/common/errors';

import * as vp from '@/../tests/createProps';

describe('AddFakeMealToDayUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let fakeMealsRepo: MemoryFakeMealsRepo;
  let addFakeMealToDayUsecase: AddFakeMealToDayUsecase;

  beforeEach(() => {
    daysRepo = new MemoryDaysRepo();
    fakeMealsRepo = new MemoryFakeMealsRepo();
    addFakeMealToDayUsecase = new AddFakeMealToDayUsecase(
      daysRepo,
      fakeMealsRepo
    );
  });

  it('should add fake meal to existing day', async () => {
    const date = new Date('2023-10-01');
    const userId = 'user-1';
    const day = Day.create({
      ...vp.validDayProps,
    });
    const fakeMeal = FakeMeal.create({
      ...vp.validFakeMealProps,
    });

    await daysRepo.saveDay(day);
    await fakeMealsRepo.saveFakeMeal(fakeMeal);

    const result = await addFakeMealToDayUsecase.execute({
      date,
      userId,
      fakeMealId: fakeMeal.id,
    });

    expect(result.meals).toHaveLength(1);
    expect(result.meals[0]).toEqual(fakeMeal);
  });

  it('should add fake meal and create new day if it does not exist', async () => {
    const date = new Date('2023-10-01');
    const userId = 'user-1';
    const fakeMeal = FakeMeal.create({
      ...vp.validFakeMealProps,
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal);

    const result = await addFakeMealToDayUsecase.execute({
      date,
      userId,
      fakeMealId: fakeMeal.id,
    });

    expect(result.id).toEqual(date);
    expect(result.meals).toHaveLength(1);
    expect(result.meals[0]).toEqual(fakeMeal);
  });

  it('should throw error if fake meal does not exist', async () => {
    const date = new Date('2023-10-01');
    const userId = 'user-1';

    await expect(
      addFakeMealToDayUsecase.execute({
        date,
        userId,
        fakeMealId: 'non-existent',
      })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw error if invalid date', async () => {
    const invalidDates = [
      new Date('invalid-date'),
      new Date(''),
      null,
      undefined,
      842,
      '2023-10-01',
      [],
    ];

    for (const date of invalidDates) {
      await expect(
        addFakeMealToDayUsecase.execute({
          // @ts-expect-error testing invalid values
          date,
          userId: vp.userId,
          fakeMealId: 'fakemeal1',
        })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw error if invalid userId', async () => {
    const invalidUserIds = [
      null,
      '',
      '   ',
      undefined,
      842,
      [],
      {},
      true,
      false,
    ];

    for (const userId of invalidUserIds) {
      await expect(
        addFakeMealToDayUsecase.execute({
          date: new Date('2023-10-01'),
          // @ts-expect-error testing invalid values
          userId,
          fakeMealId: 'fakemeal1',
        })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw error if invalid fakeMealId', async () => {
    const invalidFakeMealIds = [
      null,
      '',
      '   ',
      undefined,
      842,
      [],
      {},
      true,
      false,
    ];

    for (const fakeMealId of invalidFakeMealIds) {
      await expect(
        addFakeMealToDayUsecase.execute({
          date: vp.dateId,
          userId: vp.userId,
          // @ts-expect-error testing invalid values
          fakeMealId,
        })
      ).rejects.toThrow(ValidationError);
    }
  });
});
