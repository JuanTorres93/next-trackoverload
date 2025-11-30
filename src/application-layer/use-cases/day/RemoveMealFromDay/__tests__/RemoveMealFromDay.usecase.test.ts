import { beforeEach, describe, expect, it } from 'vitest';
import { RemoveMealFromDayUsecase } from '../RemoveMealFromDay.usecase';
import { MemoryDaysRepo } from '@/infra/memory/MemoryDaysRepo';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { Day } from '@/domain/entities/day/Day';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { User } from '@/domain/entities/user/User';
import { NotFoundError, ValidationError } from '@/domain/common/errors';

import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';

describe('RemoveMealFromDayUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let usersRepo: MemoryUsersRepo;
  let removeMealFromDayUsecase: RemoveMealFromDayUsecase;
  let user: User;

  beforeEach(async () => {
    daysRepo = new MemoryDaysRepo();
    usersRepo = new MemoryUsersRepo();
    removeMealFromDayUsecase = new RemoveMealFromDayUsecase(
      daysRepo,
      usersRepo
    );

    user = User.create({
      ...vp.validUserProps,
    });
    await usersRepo.saveUser(user);
  });

  it('should remove meal from day', async () => {
    const date = new Date('2023-10-01');
    const fakeMeal = FakeMeal.create({
      ...vp.validFakeMealProps,
    });
    const day = Day.create({
      ...vp.validDayProps,
      meals: [fakeMeal],
    });

    await daysRepo.saveDay(day);

    const result = await removeMealFromDayUsecase.execute({
      date,
      userId: vp.userId,
      mealId: vp.validFakeMealProps.id,
    });

    expect(result.meals).toHaveLength(0);
  });

  it('should return a DayDTO', async () => {
    const date = new Date('2023-10-01');
    const fakeMeal = FakeMeal.create({
      ...vp.validFakeMealProps,
    });
    const day = Day.create({
      ...vp.validDayProps,
      meals: [fakeMeal],
    });

    await daysRepo.saveDay(day);

    const result = await removeMealFromDayUsecase.execute({
      date,
      userId: vp.userId,
      mealId: vp.validFakeMealProps.id,
    });

    expect(result).not.toBeInstanceOf(Day);
    for (const prop of dto.dayDTOProperties) {
      expect(result).toHaveProperty(prop);
    }
  });

  it('should throw error if day does not exist', async () => {
    const date = new Date('2023-10-01');

    await expect(
      removeMealFromDayUsecase.execute({
        date,
        userId: vp.userId,
        mealId: vp.validFakeMealProps.id,
      })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw error if meal does not exist in day', async () => {
    const day = Day.create({
      ...vp.validDayProps,
      meals: [],
    });

    await daysRepo.saveDay(day);

    await expect(
      removeMealFromDayUsecase.execute({
        date: vp.dateId,
        userId: vp.userId,
        mealId: 'non-existent',
      })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw error if user does not exist', async () => {
    await expect(
      removeMealFromDayUsecase.execute({
        date: vp.dateId,
        userId: 'non-existent',
        mealId: vp.validFakeMealProps.id,
      })
    ).rejects.toThrow(NotFoundError);

    await expect(
      removeMealFromDayUsecase.execute({
        date: vp.dateId,
        userId: 'non-existent',
        mealId: vp.validFakeMealProps.id,
      })
    ).rejects.toThrow(/RemoveMealFromDay.*User.*not.*found/);
  });
});
