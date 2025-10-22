import { beforeEach, describe, expect, it } from 'vitest';
import { GetDaysByDateRangeUsecase } from '../GetDaysByDateRange.usecase';
import { MemoryDaysRepo } from '@/infra/memory/MemoryDaysRepo';
import { Day } from '@/domain/entities/day/Day';
import { ValidationError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';

describe('GetDaysByDateRangeUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let getDaysByDateRangeUsecase: GetDaysByDateRangeUsecase;
  const userId = 'user-1';

  beforeEach(() => {
    daysRepo = new MemoryDaysRepo();
    getDaysByDateRangeUsecase = new GetDaysByDateRangeUsecase(daysRepo);
  });

  it('should return days within date range', async () => {
    const day1 = Day.create({
      ...vp.validDayProps,
      id: new Date('2023-10-01'),
    });
    const day2 = Day.create({
      ...vp.validDayProps,
      id: new Date('2023-10-02'),
    });
    const day3 = Day.create({
      ...vp.validDayProps,
      id: new Date('2023-10-05'),
    });

    await daysRepo.saveDay(day1);
    await daysRepo.saveDay(day2);
    await daysRepo.saveDay(day3);

    const result = await getDaysByDateRangeUsecase.execute({
      startDate: vp.dateId,
      endDate: new Date('2023-10-02'),
      userId,
    });

    expect(result).toHaveLength(2);
    expect(result[0].id).toEqual(day1.id.toISOString());
    expect(result[1].id).toEqual(day2.id.toISOString());
    expect(result).not.toContain(day3);
  });

  it('should return an array of DayDTOs', async () => {
    const day1 = Day.create({
      ...vp.validDayProps,
      id: new Date('2023-10-01'),
    });
    const day2 = Day.create({
      ...vp.validDayProps,
      id: new Date('2023-10-02'),
    });

    await daysRepo.saveDay(day1);
    await daysRepo.saveDay(day2);

    const result = await getDaysByDateRangeUsecase.execute({
      startDate: vp.dateId,
      endDate: new Date('2023-10-02'),
      userId,
    });

    expect(result).toHaveLength(2);
    expect(result[0]).not.toBeInstanceOf(Day);
    for (const prop of dto.dayDTOProperties) {
      expect(result[0]).toHaveProperty(prop);
    }

    expect(result[1]).not.toBeInstanceOf(Day);
    for (const prop of dto.dayDTOProperties) {
      expect(result[1]).toHaveProperty(prop);
    }
  });

  it('should return empty array if no days in range', async () => {
    const result = await getDaysByDateRangeUsecase.execute({
      startDate: vp.dateId,
      endDate: new Date('2023-10-02'),
      userId,
    });

    expect(result).toEqual([]);
  });

  it('should throw error if start date is after end date', async () => {
    await expect(
      getDaysByDateRangeUsecase.execute({
        startDate: new Date('2023-10-02'),
        endDate: vp.dateId,
        userId,
      })
    ).rejects.toThrow(ValidationError);
  });

  it('should include days on boundary dates', async () => {
    const day1 = Day.create({
      ...vp.validDayProps,
      id: new Date('2023-10-01'),
    });
    const day2 = Day.create({
      ...vp.validDayProps,
      id: new Date('2023-10-03'),
    });

    await daysRepo.saveDay(day1);
    await daysRepo.saveDay(day2);

    const result = await getDaysByDateRangeUsecase.execute({
      startDate: new Date('2023-10-01'),
      userId,
      endDate: new Date('2023-10-03'),
    });

    expect(result).toHaveLength(2);
    expect(result[0].id).toEqual(day1.id.toISOString());
    expect(result[1].id).toEqual(day2.id.toISOString());
  });

  it('should throw error if startDate is invalid', async () => {
    const invalidDates = [
      new Date('invalid'),
      null,
      undefined,
      '2023-10-01',
      12345,
      {},
      [],
      NaN,
    ];

    for (const invalidDate of invalidDates) {
      await expect(
        getDaysByDateRangeUsecase.execute({
          // @ts-expect-error Testing invalid inputs
          startDate: invalidDate,
          userId,
          endDate: new Date('2023-10-02'),
        })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw error if endDate is invalid', async () => {
    const invalidDates = [
      new Date('invalid'),
      null,
      undefined,
      '2023-10-01',
      12345,
      {},
      [],
      NaN,
    ];

    for (const invalidDate of invalidDates) {
      await expect(
        getDaysByDateRangeUsecase.execute({
          startDate: vp.dateId,
          userId,
          // @ts-expect-error Testing invalid inputs
          endDate: invalidDate,
        })
      ).rejects.toThrow(ValidationError);
    }
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

    for (const invalidUserId of invalidUserIds) {
      await expect(
        getDaysByDateRangeUsecase.execute({
          startDate: vp.dateId,
          // @ts-expect-error Testing invalid inputs
          userId: invalidUserId,
          endDate: new Date('2023-10-02'),
        })
      ).rejects.toThrow(ValidationError);
    }
  });
});
