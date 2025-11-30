import * as vp from '@/../tests/createProps';
import { NotFoundError } from '@/domain/common/errors';
import { Day } from '@/domain/entities/day/Day';
import { MemoryDaysRepo } from '@/infra/memory/MemoryDaysRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { DeleteDayUsecase } from '../DeleteDay.usecase';

describe('DeleteDayUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let deleteDayUsecase: DeleteDayUsecase;

  beforeEach(() => {
    daysRepo = new MemoryDaysRepo();
    deleteDayUsecase = new DeleteDayUsecase(daysRepo);
  });

  it('should delete a day', async () => {
    const day = Day.create({
      ...vp.validDayProps,
    });
    await daysRepo.saveDay(day);

    await deleteDayUsecase.execute({ date: vp.dateId, userId: vp.userId });

    const result = await daysRepo.getDayById(vp.dateId.toISOString());
    expect(result).toBeNull();
  });

  it('should throw error when deleting non-existent day', async () => {
    await expect(
      deleteDayUsecase.execute({ date: vp.dateId, userId: vp.userId })
    ).rejects.toThrow(NotFoundError);
    await expect(
      deleteDayUsecase.execute({ date: vp.dateId, userId: vp.userId })
    ).rejects.toThrow(/DeleteDayUsecase.*Day not found/);
  });
});
