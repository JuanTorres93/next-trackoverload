import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import { FileSystemDaysRepo } from '../FileSystemDaysRepo';
import { Day } from '@/domain/entities/day/Day';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import * as vp from '@/../tests/createProps';
import * as fakeMealTestProps from '../../../../../tests/createProps/fakeMealTestProps';
import * as userTestProps from '../../../../../tests/createProps/userTestProps';
import fs from 'fs/promises';
import path from 'path';

describe('FileSystemDaysRepo', () => {
  let repo: FileSystemDaysRepo;
  let day: Day;
  let fakeMeal: FakeMeal;
  const testDir = './__test_data__/days';

  beforeEach(async () => {
    repo = new FileSystemDaysRepo(testDir);
    fakeMeal = FakeMeal.create(fakeMealTestProps.validFakeMealProps);

    day = Day.create({
      ...vp.validDayProps(),
    });

    day.addFakeMeal(fakeMeal.id);

    await repo.saveDay(day);
  });

  afterEach(async () => {
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch {
      // Directory might not exist
    }
  });

  it('should save a day', async () => {
    const newDay = Day.create({
      ...vp.validDayProps(),
      day: 2,
      month: 10,
      year: 1111,
    });
    newDay.addFakeMeal(fakeMeal.id);
    await repo.saveDay(newDay);

    const allDays = await repo.getAllDays();
    expect(allDays.length).toBe(2);

    const savedDay = allDays.find((d) => d.id === '11111002');
    expect(savedDay).toBeDefined();
  });

  it('should update an existing day', async () => {
    const updatedDay = Day.create({
      ...vp.validDayProps(),
    });
    await repo.saveDay(updatedDay);

    const allDays = await repo.getAllDays();
    expect(allDays.length).toBe(1);
    expect(allDays[0].mealIds.length).toBe(0);
  });

  it('should retrieve a day by ID', async () => {
    const fetchedDay = await repo.getDayById('20231001');
    expect(fetchedDay).not.toBeNull();
    expect(fetchedDay?.id).toEqual('20231001');
  });

  it('should retrieve days by user ID', async () => {
    const userDays = await repo.getAllDaysByUserId(userTestProps.userId);
    expect(userDays.length).toBe(1);
    expect(userDays[0].userId).toBe(userTestProps.userId);
  });

  it('should retrieve a day by ID and user ID', async () => {
    const fetchedDay = await repo.getDayByIdAndUserId(
      '20231001',
      userTestProps.userId,
    );
    expect(fetchedDay).not.toBeNull();
    expect(fetchedDay?.userId).toBe(userTestProps.userId);
  });

  it('should retrieve days by date range', async () => {
    // Add more days
    const day2 = Day.create({
      ...vp.validDayProps(),
      day: 2,
      month: 10,
      year: 2023,
    });

    const day3 = Day.create({
      ...vp.validDayProps(),
      day: 5,
      month: 10,
      year: 2023,
    });

    await repo.saveDay(day2);
    await repo.saveDay(day3);

    const daysInRange = await repo.getDaysByDateRange('20231001', '20231003');

    expect(daysInRange.length).toBe(2);
  });

  it('should retrieve days by date range and user ID', async () => {
    const day2 = Day.create({
      ...vp.validDayProps(),
      day: 2,
      month: 10,
      year: 2023,
    });
    await repo.saveDay(day2);

    const daysInRange = await repo.getDaysByDateRangeAndUserId(
      '20231001',
      '20231003',
      userTestProps.userId,
    );

    expect(daysInRange.length).toBe(2);
    expect(daysInRange.every((d) => d.userId === userTestProps.userId)).toBe(
      true,
    );
  });

  it('should return null for non-existent day ID', async () => {
    const fetchedDay = await repo.getDayById('2023-12-31');
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
    const day2 = Day.create({
      ...vp.validDayProps(),
      day: 2,
      month: 10,
      year: 2023,
    });
    await repo.saveDay(day2);

    const day3 = Day.create({
      ...vp.validDayProps(),
      userId: 'user-2',
      day: 3,
      month: 10,
      year: 2023,
    });
    await repo.saveDay(day3);

    const allDaysBefore = await repo.getAllDays();
    expect(allDaysBefore.length).toBe(3);

    await repo.deleteAllDaysForUser(userTestProps.userId);

    const allDaysAfter = await repo.getAllDays();
    expect(allDaysAfter.length).toBe(1);
    expect(allDaysAfter[0].userId).toBe('user-2');
  });

  it('should persist day to filesystem with correct filename', async () => {
    // Verify file exists with correct name (YYYYMMDD.json)
    const fileName = `${day.id}.json`;
    const filePath = path.join(testDir, fileName);

    const fileExists = await fs
      .access(filePath)
      .then(() => true)
      .catch(() => false);
    expect(fileExists).toBe(true);

    // Verify file content
    const content = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(content);
    expect(data.userId).toBe(userTestProps.userId);
    expect(data.fakeMealIds).toHaveLength(1);
  });
});
