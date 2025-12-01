import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { toDayDTO } from '@/application-layer/dtos/DayDTO';
import { Day } from '@/domain/entities/day/Day';
import { MemoryDaysRepo } from '@/infra/memory/MemoryDaysRepo';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreateDayUsecase } from '../CreateDay.usecase';
import { User } from '@/domain/entities/user/User';
import { NotFoundError } from '@/domain/common/errors';

describe('CreateDayUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let usersRepo: MemoryUsersRepo;
  let createDayUsecase: CreateDayUsecase;
  let user: User;
  const dayId = '20231001';

  beforeEach(async () => {
    daysRepo = new MemoryDaysRepo();
    usersRepo = new MemoryUsersRepo();
    createDayUsecase = new CreateDayUsecase(daysRepo, usersRepo);

    user = User.create({
      ...vp.validUserProps,
    });

    await usersRepo.saveUser(user);
  });

  it('should create and save a new day', async () => {
    const request = { date: dayId, userId: vp.userId };

    const day = await createDayUsecase.execute(request);

    expect(day.id).toEqual(request.date);
    expect(day.meals).toEqual([]);
    expect(day.calories).toBe(0);
    expect(day.protein).toBe(0);
    expect(day).toHaveProperty('createdAt');
    expect(day).toHaveProperty('updatedAt');

    const savedDay = await daysRepo.getDayById(day.id);

    // @ts-expect-error savedDay won't be null
    expect(toDayDTO(savedDay)).toEqual(day);
  });

  it('should return DayDTO', async () => {
    const request = { date: dayId, userId: vp.userId };

    const day = await createDayUsecase.execute(request);

    expect(day).not.toBeInstanceOf(Day);
    for (const prop of dto.dayDTOProperties) {
      expect(day).toHaveProperty(prop);
    }
  });

  it('should create a day with initial meals', async () => {
    const request = {
      date: dayId,
      userId: vp.userId,
      meals: [],
    };

    const day = await createDayUsecase.execute(request);

    expect(day.id).toEqual(request.date);
    expect(day.meals).toEqual([]);
  });

  it('should throw error if user does not exist', async () => {
    const request = { date: dayId, userId: 'non-existent' };

    await expect(createDayUsecase.execute(request)).rejects.toThrow(
      NotFoundError
    );
    await expect(createDayUsecase.execute(request)).rejects.toThrow(
      /CreateDayUsecase.*user.*not.*found/
    );
  });
});
