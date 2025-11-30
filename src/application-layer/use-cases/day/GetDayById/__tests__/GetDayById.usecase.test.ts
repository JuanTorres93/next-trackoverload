import { Day } from '@/domain/entities/day/Day';
import { MemoryDaysRepo } from '@/infra/memory/MemoryDaysRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetDayByIdUsecase } from '../GetDayById.usecase';

import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';

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
    for (const prop of dto.dayDTOProperties) {
      expect(result).toHaveProperty(prop);
    }
  });

  it('should return null if day does not exist', async () => {
    const nonExistentDate = new Date('2023-12-31');
    const result = await getDayByIdUsecase.execute({
      date: nonExistentDate,
      userId: vp.userId,
    });

    expect(result).toBeNull();
  });
});
