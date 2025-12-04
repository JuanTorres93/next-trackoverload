import { NotFoundError } from '@/domain/common/errors';
import { Day } from '@/domain/entities/day/Day';
import { User } from '@/domain/entities/user/User';
import { MemoryDaysRepo } from '@/infra/memory/MemoryDaysRepo';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetDayByIdUsecase } from '../GetDayById.usecase';

import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';

describe('GetDayByIdUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let usersRepo: MemoryUsersRepo;
  let getDayByIdUsecase: GetDayByIdUsecase;
  let day: Day;
  let user: User;

  beforeEach(async () => {
    daysRepo = new MemoryDaysRepo();
    usersRepo = new MemoryUsersRepo();
    getDayByIdUsecase = new GetDayByIdUsecase(daysRepo, usersRepo);

    user = User.create({
      ...vp.validUserProps,
    });
    await usersRepo.saveUser(user);

    day = Day.create({
      ...vp.validDayProps(),
    });
    await daysRepo.saveDay(day);
  });

  it('should return a day if it exists', async () => {
    const result = await getDayByIdUsecase.execute({
      dayId: day.id,
      userId: vp.userId,
    });

    expect(result!.id).toEqual(day.id);
  });

  it('should return DayDTO', async () => {
    const result = await getDayByIdUsecase.execute({
      dayId: day.id,
      userId: vp.userId,
    });

    expect(result).not.toBeInstanceOf(Day);
    for (const prop of dto.dayDTOProperties) {
      expect(result).toHaveProperty(prop);
    }
  });

  it('should return null if day does not exist', async () => {
    const result = await getDayByIdUsecase.execute({
      dayId: '11110122',
      userId: vp.userId,
    });

    expect(result).toBeNull();
  });

  it('should throw error if user does not exist', async () => {
    await expect(
      getDayByIdUsecase.execute({
        dayId: day.id,
        userId: 'non-existent',
      })
    ).rejects.toThrow(NotFoundError);

    await expect(
      getDayByIdUsecase.execute({
        dayId: day.id,
        userId: 'non-existent',
      })
    ).rejects.toThrow(/GetDayById.*User.*not.*found/);
  });
});
