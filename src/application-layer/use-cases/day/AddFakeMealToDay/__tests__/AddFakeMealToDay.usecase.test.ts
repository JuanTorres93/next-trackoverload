import { NotFoundError } from '@/domain/common/errors';
import { Day } from '@/domain/entities/day/Day';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { MemoryDaysRepo } from '@/infra/memory/MemoryDaysRepo';
import { MemoryFakeMealsRepo } from '@/infra/memory/MemoryFakeMealsRepo';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { AddFakeMealToDayUsecase } from '../AddFakeMealToDay.usecase';

import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { User } from '@/domain/entities/user/User';

describe('AddFakeMealToDayUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let fakeMealsRepo: MemoryFakeMealsRepo;
  let usersRepo: MemoryUsersRepo;
  let addFakeMealToDayUsecase: AddFakeMealToDayUsecase;
  let date: Date;
  let day: Day;
  let fakeMeal: FakeMeal;
  let user: User;
  let anotherUser: User;

  beforeEach(async () => {
    daysRepo = new MemoryDaysRepo();
    fakeMealsRepo = new MemoryFakeMealsRepo();
    usersRepo = new MemoryUsersRepo();
    addFakeMealToDayUsecase = new AddFakeMealToDayUsecase(
      daysRepo,
      fakeMealsRepo,
      usersRepo
    );

    date = new Date('2023-10-01');
    day = Day.create({
      ...vp.validDayProps,
    });
    fakeMeal = FakeMeal.create({
      ...vp.validFakeMealProps,
    });

    user = User.create({
      ...vp.validUserProps,
    });

    anotherUser = User.create({
      ...vp.validUserProps,
      id: 'another-user-id',
    });

    await daysRepo.saveDay(day);
    await fakeMealsRepo.saveFakeMeal(fakeMeal);
    await usersRepo.saveUser(user);
    await usersRepo.saveUser(anotherUser);
  });

  it('should add fake meal to existing day', async () => {
    const result = await addFakeMealToDayUsecase.execute({
      date,
      userId: user.id,
      fakeMealId: fakeMeal.id,
    });

    expect(result.meals).toHaveLength(1);
    expect(result.meals[0].id).toEqual(fakeMeal.id);
  });

  it('should return DayDTO', async () => {
    const result = await addFakeMealToDayUsecase.execute({
      date,
      userId: user.id,
      fakeMealId: fakeMeal.id,
    });

    expect(result).not.toBeInstanceOf(Day);
    for (const prop of dto.dayDTOProperties) {
      expect(result).toHaveProperty(prop);
    }
  });

  it('should add fake meal and create new day if it does not exist', async () => {
    const date = new Date('2023-06-06');

    const result = await addFakeMealToDayUsecase.execute({
      date,
      userId: user.id,
      fakeMealId: fakeMeal.id,
    });

    expect(result.id).toEqual(date.toISOString());
    expect(result.meals).toHaveLength(1);
    expect(result.meals[0].id).toEqual(fakeMeal.id);
  });

  it('should throw error if fake meal does not exist', async () => {
    await expect(
      addFakeMealToDayUsecase.execute({
        date,
        userId: user.id,
        fakeMealId: 'non-existent',
      })
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw error if user does not exist', async () => {
    await expect(
      addFakeMealToDayUsecase.execute({
        date,
        userId: 'non-existent',
        fakeMealId: fakeMeal.id,
      })
    ).rejects.toThrow(NotFoundError);

    await expect(
      addFakeMealToDayUsecase.execute({
        date,
        userId: 'non-existent',
        fakeMealId: fakeMeal.id,
      })
    ).rejects.toThrow(/AddFakeMealToDay.*User.*not.*found/);
  });

  it('should throw error if day does not belong to user', async () => {
    await expect(
      addFakeMealToDayUsecase.execute({
        date,
        userId: anotherUser.id,
        fakeMealId: fakeMeal.id,
      })
    ).rejects.toThrow(NotFoundError);
  });
});
