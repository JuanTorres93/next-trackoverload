import * as vp from '@/../tests/createProps';
import { NotFoundError } from '@/domain/common/errors';
import { Day } from '@/domain/entities/day/Day';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { User } from '@/domain/entities/user/User';
import { MemoryDaysRepo } from '@/infra/memory/MemoryDaysRepo';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetDayNutritionalSummaryUsecase } from '../GetDayNutritionalSummary.usecase';

describe('GetDayNutritionalSummaryUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let usersRepo: MemoryUsersRepo;
  let getDayNutritionalSummaryUsecase: GetDayNutritionalSummaryUsecase;
  let user: User;
  const userId = 'user-1';

  beforeEach(async () => {
    daysRepo = new MemoryDaysRepo();
    usersRepo = new MemoryUsersRepo();
    getDayNutritionalSummaryUsecase = new GetDayNutritionalSummaryUsecase(
      daysRepo,
      usersRepo
    );

    user = User.create({
      ...vp.validUserProps,
      id: userId,
    });
    await usersRepo.saveUser(user);
  });

  it('should return nutritional summary for a day', async () => {
    const fakeMeal1 = FakeMeal.create({
      ...vp.validFakeMealProps,
    });
    const fakeMeal2 = FakeMeal.create({
      ...vp.validFakeMealProps,
      calories: 500,
      protein: 30,
      id: 'fakeMeal2',
    });
    const day = Day.create({
      ...vp.validDayProps(),
      meals: [fakeMeal1, fakeMeal2],
    });

    await daysRepo.saveDay(day);

    const result = await getDayNutritionalSummaryUsecase.execute({
      date: vp.dateId,
      userId,
    });

    expect(result).toEqual({
      date: vp.dateId,
      totalCalories: vp.validFakeMealProps.calories + fakeMeal2.calories, // 200 + 500
      totalProtein: vp.validFakeMealProps.protein + fakeMeal2.protein, // 30 + 30
      mealsCount: 2,
    });
  });

  it('should return zero values for day with no meals', async () => {
    const day = Day.create({
      ...vp.validDayProps(),
      meals: [],
    });

    await daysRepo.saveDay(day);

    const result = await getDayNutritionalSummaryUsecase.execute({
      date: vp.dateId,
      userId,
    });

    expect(result).toEqual({
      date: vp.dateId,
      totalCalories: 0,
      totalProtein: 0,
      mealsCount: 0,
    });
  });

  it('should throw error if day does not exist', async () => {
    const date = new Date('2023-10-01');

    await expect(
      getDayNutritionalSummaryUsecase.execute({ date, userId })
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw error if user does not exist', async () => {
    await expect(
      getDayNutritionalSummaryUsecase.execute({
        date: vp.dateId,
        userId: 'non-existent',
      })
    ).rejects.toThrow(NotFoundError);

    await expect(
      getDayNutritionalSummaryUsecase.execute({
        date: vp.dateId,
        userId: 'non-existent',
      })
    ).rejects.toThrow(/GetDayNutritionalSummary.*User.*not.*found/);
  });
});
