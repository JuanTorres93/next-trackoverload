import * as dayTestProps from '../../../../../tests/createProps/dayTestProps';
import * as fakeMealTestProps from '../../../../../tests/createProps/fakeMealTestProps';
import * as userTestProps from '../../../../../tests/createProps/userTestProps';
import { Day } from '@/domain/entities/day/Day';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryDaysRepo } from '../MemoryDaysRepo';

describe('MemoryDaysRepo', () => {
  let repo: MemoryDaysRepo;
  let day: Day;
  let fakeMeal: FakeMeal;

  beforeEach(async () => {
    repo = new MemoryDaysRepo();

    fakeMeal = fakeMealTestProps.createTestFakeMeal();

    day = dayTestProps.createEmptyTestDay();

    day.addFakeMeal(fakeMeal.id);

    await repo.saveDay(day);
  });

  it('should save a day', async () => {
    const newDay = dayTestProps.createEmptyTestDay({
      day: 2,
      month: 10,
      year: 2023,
    });

    newDay.addFakeMeal(fakeMeal.id);
    await repo.saveDay(newDay);

    const allDays = await repo.getAllDays();
    expect(allDays.length).toBe(2);
    expect(allDays[1].id).toEqual('20231002');
  });

  it('should update an existing day', async () => {
    const updatedDay = dayTestProps.createEmptyTestDay();
    await repo.saveDay(updatedDay);

    const allDays = await repo.getAllDays();

    expect(allDays.length).toBe(1);
    expect(allDays[0].fakeMealIds.length).toBe(0);
  });

  it('should retrieve a day by ID', async () => {
    const fetchedDay = await repo.getDayById('20231001');
    expect(fetchedDay).not.toBeNull();
    expect(fetchedDay!.id).toEqual('20231001');
  });

  it('should return null for non-existent day ID', async () => {
    const fetchedDay = await repo.getDayById('20231101');
    expect(fetchedDay).toBeNull();
  });

  it('should delete a day by ID and user ID', async () => {
    const allDays = await repo.getAllDays();
    expect(allDays.length).toBe(1);

    await repo.deleteDayForUser('20231001', userTestProps.userId);
    const allDaysAfterDeletion = await repo.getAllDays();
    expect(allDaysAfterDeletion.length).toBe(0);
  });

  it('should delete all days for a user', async () => {
    const day2 = dayTestProps.createEmptyTestDay({
      day: 2,
      month: 10,
      year: 2023,
    });

    const day3 = dayTestProps.createEmptyTestDay({
      userId: 'user-2',
      day: 3,
      month: 10,
      year: 2023,
    });

    await repo.saveDay(day2);
    await repo.saveDay(day3);

    const allDaysBefore = await repo.getAllDays();
    expect(allDaysBefore.length).toBe(3);

    await repo.deleteAllDaysForUser(userTestProps.userId);

    const allDaysAfter = await repo.getAllDays();
    expect(allDaysAfter.length).toBe(1);
    expect(allDaysAfter[0].userId).toBe('user-2');
  });

  it('should retrieve multiple days by IDs and user ID', async () => {
    const day2 = dayTestProps.createEmptyTestDay({
      day: 2,
      month: 10,
      year: 2023,
    });

    const day3 = dayTestProps.createEmptyTestDay({
      day: 3,
      month: 10,
      year: 2023,
    });

    const day4OtherUser = dayTestProps.createEmptyTestDay({
      userId: 'user-2',
      day: 4,
      month: 10,
      year: 2023,
    });

    await repo.saveDay(day2);
    await repo.saveDay(day3);
    await repo.saveDay(day4OtherUser);

    const days = await repo.getMultipleDaysByIdsAndUserId(
      ['20231001', '20231002', '20231004'],
      userTestProps.userId,
    );

    expect(days.length).toBe(2);
    expect(days.map((d) => d.id)).toContain('20231001');
    expect(days.map((d) => d.id)).toContain('20231002');
    expect(days.every((d) => d.userId === userTestProps.userId)).toBe(true);
  });

  it('should return empty array when no days match the IDs and user ID', async () => {
    const days = await repo.getMultipleDaysByIdsAndUserId(
      ['20231101', '20231102'],
      userTestProps.userId,
    );

    expect(days.length).toBe(0);
  });

  it('should return empty array when IDs match but user ID does not', async () => {
    const days = await repo.getMultipleDaysByIdsAndUserId(
      ['20231001'],
      'other-user',
    );

    expect(days.length).toBe(0);
  });
});
