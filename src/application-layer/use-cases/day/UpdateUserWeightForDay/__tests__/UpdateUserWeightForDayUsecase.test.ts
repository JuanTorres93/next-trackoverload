import { NotFoundError } from '@/domain/common/errors';
import { Day } from '@/domain/entities/day/Day';
import { User } from '@/domain/entities/user/User';
import { MemoryDaysRepo } from '@/infra/repos/memory/MemoryDaysRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateUserWeightForDayUsecase } from '../UpdateUserWeightForDayUsecase';

import * as dayTestProps from '@/../tests/createProps/dayTestProps';
import * as userTestProps from '@/../tests/createProps/userTestProps';
import * as dto from '@/../tests/dtoProperties';

describe('UpdateUserWeightForDayUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let usersRepo: MemoryUsersRepo;
  let usecase: UpdateUserWeightForDayUsecase;

  let user: User;
  let day: Day;

  beforeEach(async () => {
    daysRepo = new MemoryDaysRepo();
    usersRepo = new MemoryUsersRepo();
    usecase = new UpdateUserWeightForDayUsecase(daysRepo, usersRepo);

    user = userTestProps.createTestUser();
    day = dayTestProps.createEmptyTestDay();

    await usersRepo.saveUser(user);
    await daysRepo.saveDay(day);
  });

  describe('Execution', () => {
    it('should return a DayDTO', async () => {
      const result = await usecase.execute({
        dayId: day.id,
        userId: userTestProps.userId,
        newWeightInKg: 75,
      });

      expect(result).not.toBeInstanceOf(Day);
      for (const prop of dto.dayDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });

    it('should update userWeightInKg in the returned DTO', async () => {
      const result = await usecase.execute({
        dayId: day.id,
        userId: userTestProps.userId,
        newWeightInKg: 80,
      });

      expect(result.userWeightInKg).toBe(80);
    });
  });

  describe('Side effects', () => {
    it('should persist the updated weight in the repo', async () => {
      await usecase.execute({
        dayId: day.id,
        userId: userTestProps.userId,
        newWeightInKg: 90,
      });

      const updatedDay = await daysRepo.getDayByIdAndUserId(
        day.id,
        userTestProps.userId,
      );
      expect(updatedDay!.userWeightInKg).toBe(90);
    });

    it('should create a new day if it does not exist', async () => {
      const initialDayCount = daysRepo.countForTesting();

      await usecase.execute({
        dayId: '19900101',
        userId: userTestProps.userId,
        newWeightInKg: 70,
      });

      expect(daysRepo.countForTesting()).toBe(initialDayCount + 1);
    });

    it('should set weight on newly created day', async () => {
      const result = await usecase.execute({
        dayId: '19900102',
        userId: userTestProps.userId,
        newWeightInKg: 70,
      });

      expect(result.userWeightInKg).toBe(70);
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError if user does not exist', async () => {
      await expect(
        usecase.execute({
          dayId: day.id,
          userId: 'non-existent-user',
          newWeightInKg: 75,
        }),
      ).rejects.toThrow(NotFoundError);

      await expect(
        usecase.execute({
          dayId: day.id,
          userId: 'non-existent-user',
          newWeightInKg: 75,
        }),
      ).rejects.toThrow(/UpdateUserWeightForDayUsecase.*User.*not found/);
    });
  });
});
