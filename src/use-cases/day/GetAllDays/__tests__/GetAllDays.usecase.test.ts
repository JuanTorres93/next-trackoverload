import { beforeEach, describe, expect, it } from 'vitest';
import { GetAllDaysUsecase } from '../GetAllDays.usecase';
import { MemoryDaysRepo } from '@/infra/memory/MemoryDaysRepo';
import { Day } from '@/domain/entities/day/Day';

describe('GetAllDaysUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let getAllDaysUsecase: GetAllDaysUsecase;

  beforeEach(() => {
    daysRepo = new MemoryDaysRepo();
    getAllDaysUsecase = new GetAllDaysUsecase(daysRepo);
  });

  it('should return all days', async () => {
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
    await daysRepo.saveDay(day1);
    await daysRepo.saveDay(day2);

    const result = await getAllDaysUsecase.execute();

    expect(result).toHaveLength(2);
    expect(result).toContain(day1);
    expect(result).toContain(day2);
  });

  it('should return empty array if no days exist', async () => {
    const result = await getAllDaysUsecase.execute();

    expect(result).toEqual([]);
  });
});
