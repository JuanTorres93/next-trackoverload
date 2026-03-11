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

    it('should throw NotFoundError if day does not exist', async () => {
      await expect(
        usecase.execute({
          dayId: 'non-existent-day',
          userId: userTestProps.userId,
          newWeightInKg: 75,
        }),
      ).rejects.toThrow(NotFoundError);

      await expect(
        usecase.execute({
          dayId: 'non-existent-day',
          userId: userTestProps.userId,
          newWeightInKg: 75,
        }),
      ).rejects.toThrow(/UpdateUserWeightForDayUsecase.*Day not found/);
    });

    it("should throw NotFoundError when updating another user's day", async () => {
      const anotherUser = userTestProps.createTestUser({
        id: 'another-user-id',
        email: 'another@example.com',
      });
      await usersRepo.saveUser(anotherUser);

      await expect(
        usecase.execute({
          dayId: day.id,
          userId: anotherUser.id,
          newWeightInKg: 75,
        }),
      ).rejects.toThrow(NotFoundError);

      await expect(
        usecase.execute({
          dayId: day.id,
          userId: anotherUser.id,
          newWeightInKg: 75,
        }),
      ).rejects.toThrow(/UpdateUserWeightForDayUsecase.*Day not found/);
    });
  });
});
