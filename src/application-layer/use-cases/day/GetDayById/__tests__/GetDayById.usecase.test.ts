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

  describe('Found', () => {
    it('should return a day if it exists', async () => {
      const result = await getDayByIdUsecase.execute({
        dayId: day.id,
        userId: vp.userId,
      });

      expect(result!.id).toEqual(day.id);
    });

    it('should have list of meals ids', async () => {
      const result = await getDayByIdUsecase.execute({
        dayId: day.id,
        userId: vp.userId,
      });

      expect(result).toHaveProperty('mealIds');
      expect(Array.isArray(result!.mealIds)).toBe(true);
    });

    it('should have list of fake meals ids', async () => {
      const result = await getDayByIdUsecase.execute({
        dayId: day.id,
        userId: vp.userId,
      });

      expect(result).toHaveProperty('fakeMealIds');
      expect(Array.isArray(result!.fakeMealIds)).toBe(true);
    });

    it('should populate meal ids correctly', async () => {
      const mealIds = ['meal1', 'meal2', 'meal3'];
      for (const mealId of mealIds) {
        day.addMeal(mealId);
      }
      await daysRepo.saveDay(day);

      const result = await getDayByIdUsecase.execute({
        dayId: day.id,
        userId: vp.userId,
      });

      expect(result!.mealIds).toEqual(mealIds);
      expect(result!.fakeMealIds).toEqual([]);
    });

    it('should populate fake meal ids correctly', async () => {
      const fakeMealIds = ['fakeMeal1', 'fakeMeal2'];
      for (const fakeMealId of fakeMealIds) {
        day.addFakeMeal(fakeMealId);
      }
      await daysRepo.saveDay(day);

      const result = await getDayByIdUsecase.execute({
        dayId: day.id,
        userId: vp.userId,
      });

      expect(result!.fakeMealIds).toEqual(fakeMealIds);
      expect(result!.mealIds).toEqual([]);
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
  });

  describe('Errors', () => {
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
});
