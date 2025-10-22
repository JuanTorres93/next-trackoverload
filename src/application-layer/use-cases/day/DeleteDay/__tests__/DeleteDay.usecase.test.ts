import { beforeEach, describe, expect, it } from 'vitest';
import { DeleteDayUsecase } from '../DeleteDay.usecase';
import { MemoryDaysRepo } from '@/infra/memory/MemoryDaysRepo';
import { Day } from '@/domain/entities/day/Day';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';

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
  });

  it('should throw error when date is invalid', async () => {
    const date = new Date('invalid');
    await expect(
      deleteDayUsecase.execute({ date, userId: vp.userId })
    ).rejects.toThrow(ValidationError);
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
        deleteDayUsecase.execute({ date: vp.dateId, userId })
      ).rejects.toThrow(ValidationError);
    }
  });
});
