import { beforeEach, describe, expect, it } from 'vitest';
import { DeleteDayUsecase } from '../DeleteDay.usecase';
import { MemoryDaysRepo } from '@/infra/memory/MemoryDaysRepo';
import { Day } from '@/domain/entities/day/Day';
import { NotFoundError, ValidationError } from '@/domain/common/errors';

describe('DeleteDayUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let deleteDayUsecase: DeleteDayUsecase;

  beforeEach(() => {
    daysRepo = new MemoryDaysRepo();
    deleteDayUsecase = new DeleteDayUsecase(daysRepo);
  });

  it('should delete a day', async () => {
    const date = new Date('2023-10-01');
    const day = Day.create({
      id: date,
      meals: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await daysRepo.saveDay(day);

    await deleteDayUsecase.execute({ date });

    const result = await daysRepo.getDayById(date.toISOString());
    expect(result).toBeNull();
  });

  it('should throw error when deleting non-existent day', async () => {
    const date = new Date('2023-10-01');
    await expect(deleteDayUsecase.execute({ date })).rejects.toThrow(
      NotFoundError
    );
  });

  it('should throw error when date is invalid', async () => {
    const date = new Date('invalid');
    await expect(deleteDayUsecase.execute({ date })).rejects.toThrow(
      ValidationError
    );
  });
});
