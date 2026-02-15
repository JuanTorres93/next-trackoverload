import { Day } from '@/domain/entities/day/Day';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import * as dayTestProps from '../../../../../tests/createProps/dayTestProps';
import { MongoDaysRepo } from '../MongoDaysRepo';
import {
  clearMongoTestDB,
  setupMongoTestDB,
  teardownMongoTestDB,
} from './setupMongoTestDB';

describe('MongoDaysRepo', () => {
  let repo: MongoDaysRepo;
  let day: Day;

  beforeAll(async () => {
    await setupMongoTestDB();
  });

  beforeEach(async () => {
    await clearMongoTestDB();

    repo = new MongoDaysRepo();

    day = dayTestProps.createEmptyTestDay();
    day.addMeal('meal-1');
    day.addFakeMeal('fakemeal-1');

    await repo.saveDay(day);
  });

  afterAll(async () => {
    await teardownMongoTestDB();
  });

  describe('saveDay', () => {
    it('should save a new day', async () => {
      const newDay = dayTestProps.createEmptyTestDay({
        day: 2,
      });
      newDay.addMeal('meal-2');

      await repo.saveDay(newDay);

      const allDays = await repo.getAllDays();
      expect(allDays.length).toBe(2);

      const savedDay = allDays.find((d) => d.day === 2);
      expect(savedDay).toBeDefined();
      expect(savedDay!.mealIds).toHaveLength(1);
      expect(savedDay!.mealIds[0]).toBe('meal-2');
    });

    it('should update an existing day', async () => {
      const existingDay = await repo.getDayById(day.id);
      expect(existingDay).not.toBeNull();
      expect(existingDay!.mealIds).toHaveLength(1);

      existingDay!.addMeal('meal-2');
      await repo.saveDay(existingDay!);

      const updatedDay = await repo.getDayById(day.id);
      expect(updatedDay!.mealIds).toHaveLength(2);
      expect(updatedDay!.mealIds).toContain('meal-1');
      expect(updatedDay!.mealIds).toContain('meal-2');
    });

    it('should update meal and fake meal arrays', async () => {
      const existingDay = await repo.getDayById(day.id);
      existingDay!.addMeal('meal-new');
      existingDay!.addFakeMeal('fakemeal-new');
      await repo.saveDay(existingDay!);

      const updatedDay = await repo.getDayById(day.id);
      expect(updatedDay!.mealIds).toHaveLength(2);
      expect(updatedDay!.fakeMealIds).toHaveLength(2);
      expect(updatedDay!.mealIds).toContain('meal-new');
      expect(updatedDay!.fakeMealIds).toContain('fakemeal-new');
    });
  });

  describe('getAllDays', () => {
    it('should retrieve all days', async () => {
      const day2 = dayTestProps.createEmptyTestDay({
        day: 2,
        userId: 'user-2',
      });
      await repo.saveDay(day2);

      const allDays = await repo.getAllDays();

      expect(allDays).toHaveLength(2);
    });

    it('should return empty array when no days exist', async () => {
      await clearMongoTestDB();
      const allDays = await repo.getAllDays();
      expect(allDays).toHaveLength(0);
    });

    it('should populate mealIds and fakeMealIds correctly', async () => {
      const allDays = await repo.getAllDays();
      const foundDay = allDays[0];

      expect(foundDay.mealIds).toHaveLength(1);
      expect(foundDay.fakeMealIds).toHaveLength(1);
      expect(foundDay.mealIds[0]).toBe('meal-1');
      expect(foundDay.fakeMealIds[0]).toBe('fakemeal-1');
    });
  });

  describe('getAllDaysByUserId', () => {
    it('should retrieve all days for a specific user', async () => {
      const day2 = dayTestProps.createEmptyTestDay({
        day: 2,
        userId: day.userId,
      });
      await repo.saveDay(day2);

      const day3 = dayTestProps.createEmptyTestDay({
        day: 3,
        userId: 'user-other',
      });
      await repo.saveDay(day3);

      const userDays = await repo.getAllDaysByUserId(day.userId);
      expect(userDays).toHaveLength(2);
      expect(userDays.every((userDay) => userDay.userId === day.userId)).toBe(
        true,
      );
    });

    it('should return empty array for user with no days', async () => {
      const days = await repo.getAllDaysByUserId('non-existent-user');
      expect(days).toHaveLength(0);
    });
  });

  describe('getDayById', () => {
    it('should retrieve a day by id', async () => {
      const foundDay = await repo.getDayById(day.id);

      expect(foundDay).not.toBeNull();
      expect(foundDay!.id).toBe(day.id);
      expect(foundDay!.day).toBe(day.day);
      expect(foundDay!.month).toBe(day.month);
      expect(foundDay!.year).toBe(day.year);
    });

    it('should return null for non-existent id', async () => {
      const foundDay = await repo.getDayById('20251231');
      expect(foundDay).toBeNull();
    });

    it('should populate mealIds and fakeMealIds', async () => {
      const foundDay = await repo.getDayById(day.id);

      expect(foundDay!.mealIds).toHaveLength(1);
      expect(foundDay!.fakeMealIds).toHaveLength(1);
      expect(foundDay!.mealIds[0]).toBe('meal-1');
      expect(foundDay!.fakeMealIds[0]).toBe('fakemeal-1');
    });
  });

  describe('getDayByIdAndUserId', () => {
    it('should retrieve a day by id and userId', async () => {
      const foundDay = await repo.getDayByIdAndUserId(day.id, day.userId);

      expect(foundDay).not.toBeNull();
      expect(foundDay!.id).toBe(day.id);
      expect(foundDay!.userId).toBe(day.userId);
    });

    it('should return null if userId does not match', async () => {
      const foundDay = await repo.getDayByIdAndUserId(day.id, 'wrong-user-id');
      expect(foundDay).toBeNull();
    });

    it('should return null if id does not exist', async () => {
      const foundDay = await repo.getDayByIdAndUserId('20251231', day.userId);
      expect(foundDay).toBeNull();
    });
  });

  describe('getDaysByDateRange', () => {
    beforeEach(async () => {
      // Add more days for range testing
      const day2 = dayTestProps.createEmptyTestDay({
        day: 2,
      });
      const day3 = dayTestProps.createEmptyTestDay({
        day: 3,
      });
      const day5 = dayTestProps.createEmptyTestDay({
        day: 5,
      });
      const day10 = dayTestProps.createEmptyTestDay({
        day: 10,
      });

      await repo.saveDay(day2);
      await repo.saveDay(day3);
      await repo.saveDay(day5);
      await repo.saveDay(day10);
    });

    it('should retrieve days within date range', async () => {
      const days = await repo.getDaysByDateRange('20231002', '20231005');

      expect(days.length).toBeGreaterThanOrEqual(3); // day 2, 3, 5
      const dayNumbers = days.map((d) => d.day);
      expect(dayNumbers).toContain(2);
      expect(dayNumbers).toContain(3);
      expect(dayNumbers).toContain(5);
    });

    it('should include start and end dates in range', async () => {
      const days = await repo.getDaysByDateRange('20231001', '20231003');

      const dayNumbers = days.map((d) => d.day);
      expect(dayNumbers).toContain(1);
      expect(dayNumbers).toContain(2);
      expect(dayNumbers).toContain(3);
    });

    it('should return empty array for range with no days', async () => {
      const days = await repo.getDaysByDateRange('20231020', '20231025');
      expect(days).toHaveLength(0);
    });
  });

  describe('getDaysByDateRangeAndUserId', () => {
    beforeEach(async () => {
      // Add days for different users
      const day2User1 = dayTestProps.createEmptyTestDay({
        day: 2,
        userId: day.userId,
      });
      const day3User1 = dayTestProps.createEmptyTestDay({
        day: 3,
        userId: day.userId,
      });

      const day2User2 = dayTestProps.createEmptyTestDay({
        day: 2,
        userId: 'user-other',
      });

      await repo.saveDay(day2User1);
      await repo.saveDay(day3User1);
      await repo.saveDay(day2User2);
    });

    it('should retrieve days within date range for specific user', async () => {
      const days = await repo.getDaysByDateRangeAndUserId(
        '20231001',
        '20231003',
        day.userId,
      );

      expect(days.length).toBe(3); // day 1, 2, 3 for user 1
      expect(days.every((d) => d.userId === day.userId)).toBe(true);
      const dayNumbers = days.map((d) => d.day);
      expect(dayNumbers).toContain(1);
      expect(dayNumbers).toContain(2);
      expect(dayNumbers).toContain(3);
    });

    it('should only return days for the specified user', async () => {
      const daysUser1 = await repo.getDaysByDateRangeAndUserId(
        '20231001',
        '20231003',
        day.userId,
      );
      const daysUser2 = await repo.getDaysByDateRangeAndUserId(
        '20231001',
        '20231003',
        'user-other',
      );

      expect(daysUser1).toHaveLength(3);
      expect(daysUser2).toHaveLength(1);
      expect(daysUser2[0].day).toBe(2);
    });

    it('should return empty array for user with no days in range', async () => {
      const days = await repo.getDaysByDateRangeAndUserId(
        '20231001',
        '20231003',
        'non-existent-user',
      );
      expect(days).toHaveLength(0);
    });
  });

  describe('deleteDayForUser', () => {
    it('should delete a day for a specific user', async () => {
      const allDaysBefore = await repo.getAllDays();
      expect(allDaysBefore).toHaveLength(1);

      await repo.deleteDayForUser(day.id, day.userId);

      const allDaysAfter = await repo.getAllDays();
      expect(allDaysAfter).toHaveLength(0);
    });

    it('should not delete day if userId does not match', async () => {
      await repo.deleteDayForUser(day.id, 'wrong-user-id');

      const allDays = await repo.getAllDays();
      expect(allDays).toHaveLength(1);
    });

    it('should not throw error when day does not exist', async () => {
      await expect(
        repo.deleteDayForUser('20251231', day.userId),
      ).resolves.not.toThrow();
    });
  });

  describe('deleteAllDaysForUser', () => {
    it('should delete all days for a specific user', async () => {
      const day2 = dayTestProps.createEmptyTestDay({
        day: 2,
      });
      const day3 = dayTestProps.createEmptyTestDay({
        day: 3,
        userId: 'user-other',
      });

      await repo.saveDay(day2);
      await repo.saveDay(day3);

      const allDaysBefore = await repo.getAllDays();
      expect(allDaysBefore).toHaveLength(3);

      await repo.deleteAllDaysForUser(day2.userId);

      const allDaysAfter = await repo.getAllDays();
      expect(allDaysAfter).toHaveLength(1);
      expect(allDaysAfter[0].userId).toBe('user-other');
    });

    it('should not throw error when user has no days', async () => {
      await expect(
        repo.deleteAllDaysForUser('non-existent-user'),
      ).resolves.not.toThrow();
    });
  });
});
