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
  let fakeMeal: FakeMeal;
  let day: Day;

  beforeEach(async () => {
    daysRepo = new MemoryDaysRepo();
    usersRepo = new MemoryUsersRepo();
    removeMealFromDayUsecase = new RemoveMealFromDayUsecase(
      daysRepo,
      usersRepo
    );

    fakeMeal = FakeMeal.create({
      ...vp.validFakeMealProps,
    });
    day = Day.create({
      ...vp.validDayProps(),
      meals: [fakeMeal],
    });

    user = User.create({
      ...vp.validUserProps,
    });

    await usersRepo.saveUser(user);
    await daysRepo.saveDay(day);
  });

  it('should remove meal from day', async () => {
    const result = await removeMealFromDayUsecase.execute({
      date: day.id,
      userId: vp.userId,
      mealId: vp.validFakeMealProps.id,
    });

    expect(result.meals).toHaveLength(0);
  });

  it('should return a DayDTO', async () => {
    const result = await removeMealFromDayUsecase.execute({
      date: day.id,
      userId: vp.userId,
      mealId: vp.validFakeMealProps.id,
    });

    expect(result).not.toBeInstanceOf(Day);
    for (const prop of dto.dayDTOProperties) {
      expect(result).toHaveProperty(prop);
    }
  });

  it('should throw error if day does not exist', async () => {
    const date = '11111001';

    await expect(
      removeMealFromDayUsecase.execute({
        date,
        userId: vp.userId,
        mealId: vp.validFakeMealProps.id,
      })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw error if meal does not exist in day', async () => {
    await expect(
      removeMealFromDayUsecase.execute({
        date: day.id,
        userId: vp.userId,
        mealId: 'non-existent',
      })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw error if user does not exist', async () => {
    await expect(
      removeMealFromDayUsecase.execute({
        date: day.id,
        userId: 'non-existent',
        mealId: vp.validFakeMealProps.id,
      })
    ).rejects.toThrow(NotFoundError);

    await expect(
      removeMealFromDayUsecase.execute({
        date: day.id,
        userId: 'non-existent',
        mealId: vp.validFakeMealProps.id,
      })
    ).rejects.toThrow(/RemoveMealFromDay.*User.*not.*found/);
  });
});
