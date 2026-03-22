import { NotFoundError } from '@/domain/common/errors';
import { Day } from '@/domain/entities/day/Day';
import { User } from '@/domain/entities/user/User';
import { MemoryDaysRepo } from '@/infra/repos/memory/MemoryDaysRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetLastDayWithCaloriesGoalForUserUsecase } from '../GetLastDayWithCaloriesGoalForUser.usecase';

import * as dayTestProps from '@/../tests/createProps/dayTestProps';
import * as userTestProps from '@/../tests/createProps/userTestProps';
import * as dto from '@/../tests/dtoProperties';

describe('GetLastDayWithCaloriesGoalForUserUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let usersRepo: MemoryUsersRepo;
  let usecase: GetLastDayWithCaloriesGoalForUserUsecase;
  let user: User;

  beforeEach(async () => {
    daysRepo = new MemoryDaysRepo();
    usersRepo = new MemoryUsersRepo();
    usecase = new GetLastDayWithCaloriesGoalForUserUsecase(daysRepo, usersRepo);

    user = userTestProps.createTestUser();
    await usersRepo.saveUser(user);
  });

  describe('Execution', () => {
    it('should return null when user has no days with calories goal', async () => {
      const result = await usecase.execute({ userId: user.id });

      expect(result).toBeNull();
    });

    it('should return null when user has days but none with a calories goal', async () => {
      const day = dayTestProps.createEmptyTestDay();
      await daysRepo.saveDay(day);

      const result = await usecase.execute({ userId: user.id });

      expect(result).toBeNull();
    });

    it('should return a DayDTO', async () => {
      const day = dayTestProps.createEmptyTestDay();
      day.updateCaloriesGoal(2000);
      await daysRepo.saveDay(day);

      const result = await usecase.execute({ userId: user.id });

      expect(result).not.toBeInstanceOf(Day);
      for (const prop of dto.dayDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });

    it('should return the most recent day with a calories goal', async () => {
      const olderDay = dayTestProps.createEmptyTestDay({
        day: 1,
        month: 1,
        year: 2023,
      });
      olderDay.updateCaloriesGoal(1800);

      const newerDay = dayTestProps.createEmptyTestDay({
        day: 15,
        month: 1,
        year: 2023,
      });
      newerDay.updateCaloriesGoal(2200);

      await daysRepo.saveDay(olderDay);
      await daysRepo.saveDay(newerDay);

      const result = await usecase.execute({ userId: user.id });

      expect(result!.id).toBe(newerDay.id);
      expect(result!.updatedCaloriesGoal).toBe(2200);
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError if user does not exist', async () => {
      await expect(
        usecase.execute({ userId: 'non-existent-user' }),
      ).rejects.toThrow(NotFoundError);

      await expect(
        usecase.execute({ userId: 'non-existent-user' }),
      ).rejects.toThrow(
        /GetLastDayWithCaloriesGoalForUserUsecase: User.*not found/,
      );
    });
  });
});
