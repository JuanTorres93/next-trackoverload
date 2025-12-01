import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import { FileSystemDaysRepo } from '../FileSystemDaysRepo';
import { Day } from '@/domain/entities/day/Day';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import * as vp from '@/../tests/createProps';
import fs from 'fs/promises';
import path from 'path';

describe('FileSystemDaysRepo', () => {
  let repo: FileSystemDaysRepo;
  let day: Day;
  let fakeMeal: FakeMeal;
  const testDir = './__test_data__/days';

  beforeEach(async () => {
    repo = new FileSystemDaysRepo(testDir);
    fakeMeal = FakeMeal.create(vp.validFakeMealProps);

    day = Day.create({
      ...vp.validDayProps(),
      meals: [fakeMeal],
    });

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
      meals: [fakeMeal],
    });
    await repo.saveDay(newDay);

    const allDays = await repo.getAllDays();
    expect(allDays.length).toBe(2);

    const savedDay = allDays.find((d) => d.id === '11111002');
    expect(savedDay).toBeDefined();
  });

  it('should update an existing day', async () => {
    const updatedDay = Day.create({
      ...vp.validDayProps(),
      meals: [], // No meals
    });
    await repo.saveDay(updatedDay);

    const allDays = await repo.getAllDays();
    expect(allDays.length).toBe(1);
    expect(allDays[0].meals.length).toBe(0);
  });

  it('should retrieve a day by ID', async () => {
    const fetchedDay = await repo.getDayById('20231001');
    expect(fetchedDay).not.toBeNull();
    expect(fetchedDay?.id).toEqual('20231001');
  });

  it('should retrieve days by user ID', async () => {
    const userDays = await repo.getAllDaysByUserId(vp.userId);
    expect(userDays.length).toBe(1);
    expect(userDays[0].userId).toBe(vp.userId);
  });

  it('should retrieve a day by ID and user ID', async () => {
    const fetchedDay = await repo.getDayByIdAndUserId('20231001', vp.userId);
    expect(fetchedDay).not.toBeNull();
    expect(fetchedDay?.userId).toBe(vp.userId);
  });

  it('should retrieve days by date range', async () => {
    // Add more days
    const day2 = Day.create({
      ...vp.validDayProps(),
      day: 2,
      month: 10,
      year: 2023,
      meals: [fakeMeal],
    });
    const day3 = Day.create({
      ...vp.validDayProps(),
      day: 5,
      month: 10,
      year: 2023,
      meals: [fakeMeal],
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
      meals: [fakeMeal],
    });
    await repo.saveDay(day2);

    const daysInRange = await repo.getDaysByDateRangeAndUserId(
      '20231001',
      '20231003',
      vp.userId
    );

    expect(daysInRange.length).toBe(2);
    expect(daysInRange.every((d) => d.userId === vp.userId)).toBe(true);
  });

  it('should return null for non-existent day ID', async () => {
    const fetchedDay = await repo.getDayById('2023-12-31');
    expect(fetchedDay).toBeNull();
  });

  it('should delete a day by ID', async () => {
    const allDays = await repo.getAllDays();
    expect(allDays.length).toBe(1);

    await repo.deleteDay('20231001');

    const allDaysAfterDeletion = await repo.getAllDays();
    expect(allDaysAfterDeletion.length).toBe(0);
  });

  it('should persist day to filesystem with correct filename', async () => {
    // Verify file exists with correct name (YYYYMMDD.json)
    const fileName = '20231001.json';
    const filePath = path.join(testDir, fileName);
    const fileExists = await fs
      .access(filePath)
      .then(() => true)
      .catch(() => false);
    expect(fileExists).toBe(true);

    // Verify file content
    const content = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(content);
    expect(data.userId).toBe(vp.userId);
    expect(data.meals).toHaveLength(1);
  });
});
