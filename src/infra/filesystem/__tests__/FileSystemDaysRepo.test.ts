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
    } catch (error) {
      // Directory might not exist
    }
  });

  it('should save a day', async () => {
    const newDay = Day.create({
      ...vp.validDayProps(),
      id: new Date('2023-10-02'),
      meals: [fakeMeal],
    });
    await repo.saveDay(newDay);

    const allDays = await repo.getAllDays();
    expect(allDays.length).toBe(2);

    const savedDay = allDays.find(
      (d) => d.id.toISOString() === new Date('2023-10-02').toISOString()
    );
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
    const fetchedDay = await repo.getDayById('2023-10-01');
    expect(fetchedDay).not.toBeNull();
    expect(fetchedDay?.id).toEqual(new Date('2023-10-01'));
  });

  it('should retrieve days by user ID', async () => {
    const userDays = await repo.getAllDaysByUserId(vp.userId);
    expect(userDays.length).toBe(1);
    expect(userDays[0].userId).toBe(vp.userId);
  });

  it('should retrieve a day by ID and user ID', async () => {
    const fetchedDay = await repo.getDayByIdAndUserId('2023-10-01', vp.userId);
    expect(fetchedDay).not.toBeNull();
    expect(fetchedDay?.userId).toBe(vp.userId);
  });

  it('should retrieve days by date range', async () => {
    // Add more days
    const day2 = Day.create({
      ...vp.validDayProps(),
      id: new Date('2023-10-02'),
      meals: [fakeMeal],
    });
    const day3 = Day.create({
      ...vp.validDayProps(),
      id: new Date('2023-10-05'),
      meals: [fakeMeal],
    });
    await repo.saveDay(day2);
    await repo.saveDay(day3);

    const daysInRange = await repo.getDaysByDateRange(
      new Date('2023-10-01'),
      new Date('2023-10-03')
    );

    expect(daysInRange.length).toBe(2);
  });

  it('should retrieve days by date range and user ID', async () => {
    const day2 = Day.create({
      ...vp.validDayProps(),
      id: new Date('2023-10-02'),
      meals: [fakeMeal],
    });
    await repo.saveDay(day2);

    const daysInRange = await repo.getDaysByDateRangeAndUserId(
      new Date('2023-10-01'),
      new Date('2023-10-03'),
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

    await repo.deleteDay('2023-10-01');

    const allDaysAfterDeletion = await repo.getAllDays();
    expect(allDaysAfterDeletion.length).toBe(0);
  });

  it('should persist day to filesystem with correct filename', async () => {
    // Verify file exists with correct name (YYYY-MM-DD.json)
    const fileName = '2023-10-01.json';
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
