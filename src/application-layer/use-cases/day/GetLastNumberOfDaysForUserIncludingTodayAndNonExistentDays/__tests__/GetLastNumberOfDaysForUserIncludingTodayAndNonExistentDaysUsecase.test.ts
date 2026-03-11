import { NotFoundError } from '@/domain/common/errors';
import { MemoryDaysRepo } from '@/infra/repos/memory/MemoryDaysRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { dateToDayId } from '@/domain/value-objects/DayId/DayId';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecase } from '../GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecase';

import * as dayTestProps from '../../../../../../tests/createProps/dayTestProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';

describe('GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let usersRepo: MemoryUsersRepo;
  let usecase: GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecase;

  beforeEach(async () => {
    daysRepo = new MemoryDaysRepo();
    usersRepo = new MemoryUsersRepo();
    usecase =
      new GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecase(
        daysRepo,
        usersRepo,
      );

    await usersRepo.saveUser(userTestProps.createTestUser());
  });

  describe('Execution', () => {
    it('should return the correct number of entries', async () => {
      const result = await usecase.execute({
        numberOfDays: 7,
        userId: userTestProps.userId,
      });

      expect(result).toHaveLength(7);
    });

    it('should return entries in chronological order', async () => {
      const result = await usecase.execute({
        numberOfDays: 5,
        userId: userTestProps.userId,
      });

      for (let i = 1; i < result.length; i++) {
        expect(result[i].date > result[i - 1].date).toBe(true);
      }
    });

    it('should return null for days with no data', async () => {
      const result = await usecase.execute({
        numberOfDays: 3,
        userId: userTestProps.userId,
      });

      expect(result.every((entry) => entry.day === null)).toBe(true);
    });

    it('should return DayDTO for days with existing data', async () => {
      const today = new Date();

      const todayDayId = dateToDayId(today);
      const day = dayTestProps.createEmptyTestDay({
        day: todayDayId.day,
        month: todayDayId.month,
        year: todayDayId.year,
      });

      await daysRepo.saveDay(day);

      const result = await usecase.execute({
        numberOfDays: 1,
        userId: userTestProps.userId,
      });

      expect(result[0].day).not.toBeNull();
      expect(result[0].day!.id).toBe(day.id);
    });

    it('should include today as the last entry', async () => {
      const todayDayId = dateToDayId(new Date()).value;

      const result = await usecase.execute({
        numberOfDays: 7,
        userId: userTestProps.userId,
      });

      expect(result[result.length - 1].date).toBe(todayDayId);
    });

    it('should not include days from another user', async () => {
      const today = new Date();
      const todayDayId = dateToDayId(today);

      const otherUserDay = dayTestProps.createEmptyTestDay({
        day: todayDayId.day,
        month: todayDayId.month,
        year: todayDayId.year,
        userId: 'other-user-id',
      });
      await daysRepo.saveDay(otherUserDay);

      const result = await usecase.execute({
        numberOfDays: 1,
        userId: userTestProps.userId,
      });

      expect(result[0].day).toBeNull();
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError if user does not exist', async () => {
      await expect(
        usecase.execute({
          numberOfDays: 7,
          userId: 'non-existent-user',
        }),
      ).rejects.toThrow(NotFoundError);
    });
  });
});
