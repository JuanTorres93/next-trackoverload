import { beforeEach, describe, expect, it } from 'vitest';
import { GetDayByIdUsecase } from '../GetDayById.usecase';
import { MemoryDaysRepo } from '@/infra/memory/MemoryDaysRepo';
import { Day } from '@/domain/entities/day/Day';
import { ValidationError } from '@/domain/common/errors';

describe('GetDayByIdUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let getDayByIdUsecase: GetDayByIdUsecase;

  beforeEach(() => {
    daysRepo = new MemoryDaysRepo();
    getDayByIdUsecase = new GetDayByIdUsecase(daysRepo);
  });

  it('should return a day if it exists', async () => {
    const date = new Date('2023-10-01');
    const day = Day.create({
      id: date,
      meals: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await daysRepo.saveDay(day);

    const result = await getDayByIdUsecase.execute({ date });

    expect(result).toEqual(day);
  });

  it('should return null if day does not exist', async () => {
    const date = new Date('2023-10-01');

    const result = await getDayByIdUsecase.execute({ date });

    expect(result).toBeNull();
  });

  it('should throw error when date is invalid', async () => {
    const date = new Date('invalid');

    await expect(getDayByIdUsecase.execute({ date })).rejects.toThrow(
      ValidationError
    );
  });
});
