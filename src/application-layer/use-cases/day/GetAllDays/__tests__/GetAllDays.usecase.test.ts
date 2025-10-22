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
    expect(result).toContain(day1);
    expect(result).toContain(day2);
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
