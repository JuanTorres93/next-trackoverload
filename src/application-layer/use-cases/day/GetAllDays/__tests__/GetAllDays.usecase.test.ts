import { beforeEach, describe, expect, it } from 'vitest';
import { GetAllDaysUsecase } from '../GetAllDays.usecase';
import { MemoryDaysRepo } from '@/infra/memory/MemoryDaysRepo';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { Day } from '@/domain/entities/day/Day';
import { User } from '@/domain/entities/user/User';
import { NotFoundError } from '@/domain/common/errors';

import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
let day1: Day;
let day2: Day;

async function createDays(daysRepo: MemoryDaysRepo) {
  day1 = Day.create({
    ...vp.validDayProps(),
  });

  day2 = Day.create({
    ...vp.validDayProps(),
    day: 2,
    month: 10,
    year: 2023,
  });

  await daysRepo.saveDay(day1);
  await daysRepo.saveDay(day2);
}

describe('GetAllDaysUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let usersRepo: MemoryUsersRepo;
  let getAllDaysUsecase: GetAllDaysUsecase;
  let user: User;

  beforeEach(async () => {
    daysRepo = new MemoryDaysRepo();
    usersRepo = new MemoryUsersRepo();
    getAllDaysUsecase = new GetAllDaysUsecase(daysRepo, usersRepo);

    user = User.create({
      ...vp.validUserProps,
    });
    await usersRepo.saveUser(user);
  });

  it('should return all days', async () => {
    await createDays(daysRepo);
    const result = await getAllDaysUsecase.execute({ userId: vp.userId });

    expect(result).toHaveLength(2);
    expect(result[0].id).toEqual(day1.id);
    expect(result[1].id).toEqual(day2.id);
  });

  it('should return an array of DayDTOs', async () => {
    await createDays(daysRepo);

    const result = await getAllDaysUsecase.execute({ userId: vp.userId });

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

  it('should return empty array if no days exist', async () => {
    const result = await getAllDaysUsecase.execute({ userId: vp.userId });

    expect(result).toEqual([]);
  });

  it('should throw error if user does not exist', async () => {
    await createDays(daysRepo);
    await expect(
      getAllDaysUsecase.execute({ userId: 'non-existent' })
    ).rejects.toThrow(NotFoundError);

    await expect(
      getAllDaysUsecase.execute({ userId: 'non-existent' })
    ).rejects.toThrow(/GetAllDaysUsecase.*User.*not.*found/);
  });
});
