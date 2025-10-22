import { beforeEach, describe, expect, it } from 'vitest';
import { GetDayByIdUsecase } from '../GetDayById.usecase';
import { MemoryDaysRepo } from '@/infra/memory/MemoryDaysRepo';
import { Day } from '@/domain/entities/day/Day';
import { ValidationError } from '@/domain/common/errors';

import * as vp from '@/../tests/createProps';

describe('GetDayByIdUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let getDayByIdUsecase: GetDayByIdUsecase;
  let day: Day;

  beforeEach(async () => {
    daysRepo = new MemoryDaysRepo();
    getDayByIdUsecase = new GetDayByIdUsecase(daysRepo);
    day = Day.create({
      ...vp.validDayProps,
    });
    await daysRepo.saveDay(day);
  });

  it('should return a day if it exists', async () => {
    const result = await getDayByIdUsecase.execute({
      date: vp.dateId,
      userId: vp.userId,
    });

    // @ts-expect-error result won't be null
    expect(result.id).toEqual(day.id.toISOString());
  });

  it('should return DayDTO', async () => {
    const result = await getDayByIdUsecase.execute({
      date: vp.dateId,
      userId: vp.userId,
    });

    expect(result).not.toBeInstanceOf(Day);
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('userId');
    expect(result).toHaveProperty('meals');
    expect(result).toHaveProperty('createdAt');
    expect(result).toHaveProperty('updatedAt');
  });

  it('should return null if day does not exist', async () => {
    const nonExistentDate = new Date('2023-12-31');
    const result = await getDayByIdUsecase.execute({
      date: nonExistentDate,
      userId: vp.userId,
    });

    expect(result).toBeNull();
  });

  it('should throw error when date is invalid', async () => {
    const invalidDates = [
      null,
      undefined,
      '2023-10-10',
      123,
      {},
      [],
      true,
      false,
    ];

    for (const date of invalidDates) {
      await expect(
        // @ts-expect-error testing invalid inputs
        getDayByIdUsecase.execute({ date, userId: vp.userId })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw error when userId is invalid', async () => {
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
        getDayByIdUsecase.execute({ date: vp.dateId, userId })
      ).rejects.toThrow(ValidationError);
    }
  });
});
