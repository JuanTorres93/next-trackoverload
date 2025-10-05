import { beforeEach, describe, expect, it } from 'vitest';
import { GetDaysByDateRangeUsecase } from '../GetDaysByDateRange.usecase';
import { MemoryDaysRepo } from '@/infra/memory/MemoryDaysRepo';
import { Day } from '@/domain/entities/day/Day';
import { ValidationError } from '@/domain/common/errors';

describe('GetDaysByDateRangeUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let getDaysByDateRangeUsecase: GetDaysByDateRangeUsecase;

  beforeEach(() => {
    daysRepo = new MemoryDaysRepo();
    getDaysByDateRangeUsecase = new GetDaysByDateRangeUsecase(daysRepo);
  });

  it('should return days within date range', async () => {
    const day1 = Day.create({
      id: new Date('2023-10-01'),
      meals: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const day2 = Day.create({
      id: new Date('2023-10-02'),
      meals: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const day3 = Day.create({
      id: new Date('2023-10-05'),
      meals: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await daysRepo.saveDay(day1);
    await daysRepo.saveDay(day2);
    await daysRepo.saveDay(day3);

    const result = await getDaysByDateRangeUsecase.execute({
      startDate: new Date('2023-10-01'),
      endDate: new Date('2023-10-02'),
    });

    expect(result).toHaveLength(2);
    expect(result).toContain(day1);
    expect(result).toContain(day2);
    expect(result).not.toContain(day3);
  });

  it('should return empty array if no days in range', async () => {
    const result = await getDaysByDateRangeUsecase.execute({
      startDate: new Date('2023-10-01'),
      endDate: new Date('2023-10-02'),
    });

    expect(result).toEqual([]);
  });

  it('should throw error if start date is after end date', async () => {
    await expect(
      getDaysByDateRangeUsecase.execute({
        startDate: new Date('2023-10-02'),
        endDate: new Date('2023-10-01'),
      })
    ).rejects.toThrow(ValidationError);
  });

  it('should include days on boundary dates', async () => {
    const day1 = Day.create({
      id: new Date('2023-10-01'),
      meals: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const day2 = Day.create({
      id: new Date('2023-10-03'),
      meals: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await daysRepo.saveDay(day1);
    await daysRepo.saveDay(day2);

    const result = await getDaysByDateRangeUsecase.execute({
      startDate: new Date('2023-10-01'),
      endDate: new Date('2023-10-03'),
    });

    expect(result).toHaveLength(2);
    expect(result).toContain(day1);
    expect(result).toContain(day2);
  });

  it('should throw error if startDate is invalid', async () => {
    await expect(
      getDaysByDateRangeUsecase.execute({
        startDate: new Date('invalid'),
        endDate: new Date('2023-10-01'),
      })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw error if endDate is invalid', async () => {
    await expect(
      getDaysByDateRangeUsecase.execute({
        startDate: new Date('2023-10-01'),
        endDate: new Date('invalid'),
      })
    ).rejects.toThrow(ValidationError);
  });
});
