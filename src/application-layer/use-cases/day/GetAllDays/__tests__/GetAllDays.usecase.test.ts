import { beforeEach, describe, expect, it } from 'vitest';
import { GetAllDaysUsecase } from '../GetAllDays.usecase';
import { MemoryDaysRepo } from '@/infra/memory/MemoryDaysRepo';
import { Day } from '@/domain/entities/day/Day';

import * as vp from '@/../tests/createProps';

describe('GetAllDaysUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let getAllDaysUsecase: GetAllDaysUsecase;

  beforeEach(() => {
    daysRepo = new MemoryDaysRepo();
    getAllDaysUsecase = new GetAllDaysUsecase(daysRepo);
  });

  it('should return all days', async () => {
    const day1 = Day.create({
      ...vp.validDayProps,
    });
    const day2 = Day.create({
      ...vp.validDayProps,
      id: new Date('2023-10-02'),
    });
    await daysRepo.saveDay(day1);
    await daysRepo.saveDay(day2);

    const result = await getAllDaysUsecase.execute({ userId: vp.userId });

    expect(result).toHaveLength(2);
    expect(result[0].id).toEqual(day1.id.toISOString());
    expect(result[1].id).toEqual(day2.id.toISOString());
  });

  it('should return an array of DayDTOs', async () => {
    const day1 = Day.create({
      ...vp.validDayProps,
    });
    const day2 = Day.create({
      ...vp.validDayProps,
      id: new Date('2023-10-02'),
    });
    await daysRepo.saveDay(day1);
    await daysRepo.saveDay(day2);

    const result = await getAllDaysUsecase.execute({ userId: vp.userId });

    expect(result).toHaveLength(2);
    expect(result[0]).not.toBeInstanceOf(Day);
    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('userId');
    expect(result[0]).toHaveProperty('meals');
    expect(result[0]).toHaveProperty('createdAt');
    expect(result[0]).toHaveProperty('updatedAt');

    expect(result[1]).not.toBeInstanceOf(Day);
    expect(result[1]).toHaveProperty('id');
    expect(result[1]).toHaveProperty('userId');
    expect(result[1]).toHaveProperty('meals');
    expect(result[1]).toHaveProperty('createdAt');
    expect(result[1]).toHaveProperty('updatedAt');
  });

  it('should return empty array if no days exist', async () => {
    const result = await getAllDaysUsecase.execute({ userId: vp.userId });

    expect(result).toEqual([]);
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
        getAllDaysUsecase.execute({ userId })
      ).rejects.toThrow();
    }
  });
});
