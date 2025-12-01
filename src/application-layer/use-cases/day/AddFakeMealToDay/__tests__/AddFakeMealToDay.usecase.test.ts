import { NotFoundError } from '@/domain/common/errors';
import { Day } from '@/domain/entities/day/Day';
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
  let day: Day;
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

    day = Day.create({
      ...vp.validDayProps(),
    });

    user = User.create({
      ...vp.validUserProps,
    });

    anotherUser = User.create({
      ...vp.validUserProps,
      id: 'another-user-id',
    });

    await daysRepo.saveDay(day);
    await usersRepo.saveUser(user);
    await usersRepo.saveUser(anotherUser);
  });

  it('should add fake meal to existing day', async () => {
    expect(day.meals).toHaveLength(0);

    const result = await addFakeMealToDayUsecase.execute({
      date: day.id,
      userId: user.id,
      name: vp.validFakeMealProps.name,
      calories: vp.validFakeMealProps.calories,
      protein: vp.validFakeMealProps.protein,
    });

    expect(result.meals).toHaveLength(1);
  });

  it('should return DayDTO', async () => {
    const result = await addFakeMealToDayUsecase.execute({
      date: day.id,
      userId: user.id,
      name: vp.validFakeMealProps.name,
      calories: vp.validFakeMealProps.calories,
      protein: vp.validFakeMealProps.protein,
    });

    expect(result).not.toBeInstanceOf(Day);
    for (const prop of dto.dayDTOProperties) {
      expect(result).toHaveProperty(prop);
    }
  });

  it('should add fake meal and create new day if it does not exist', async () => {
    expect(day.meals).toHaveLength(0);
    const currentDays = await daysRepo.getAllDays();
    expect(currentDays).toHaveLength(1);

    const date = '20230606';

    const result = await addFakeMealToDayUsecase.execute({
      date,
      userId: user.id,
      name: vp.validFakeMealProps.name,
      calories: vp.validFakeMealProps.calories,
      protein: vp.validFakeMealProps.protein,
    });

    expect(result.id).toEqual(date);
    expect(result.meals).toHaveLength(1);
    const afterDays = await daysRepo.getAllDays();
    expect(afterDays).toHaveLength(2);
  });

  it('should create new fake meal', async () => {
    const currentFakeMealCount = await fakeMealsRepo.getAllFakeMeals();
    expect(currentFakeMealCount).toHaveLength(0);

    await addFakeMealToDayUsecase.execute({
      date: day.id,
      userId: user.id,
      name: vp.validFakeMealProps.name,
      calories: vp.validFakeMealProps.calories,
      protein: vp.validFakeMealProps.protein,
    });

    const afterFakeMealCount = await fakeMealsRepo.getAllFakeMeals();
    expect(afterFakeMealCount).toHaveLength(1);
  });

  it('should throw error if user does not exist', async () => {
    await expect(
      addFakeMealToDayUsecase.execute({
        date: day.id,
        userId: 'non-existent',
        name: vp.validFakeMealProps.name,
        calories: vp.validFakeMealProps.calories,
        protein: vp.validFakeMealProps.protein,
      })
    ).rejects.toThrow(NotFoundError);

    await expect(
      addFakeMealToDayUsecase.execute({
        date: day.id,
        userId: 'non-existent',
        name: vp.validFakeMealProps.name,
        calories: vp.validFakeMealProps.calories,
        protein: vp.validFakeMealProps.protein,
      })
    ).rejects.toThrow(/AddFakeMealToDay.*User.*not.*found/);
  });
});
