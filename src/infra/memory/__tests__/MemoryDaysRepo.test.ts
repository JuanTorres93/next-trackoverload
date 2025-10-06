import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryDaysRepo } from '../MemoryDaysRepo';
import { Day } from '@/domain/entities/day/Day';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import * as vp from '@/../tests/createProps';

describe('MemoryDaysRepo', () => {
  let repo: MemoryDaysRepo;
  let day: Day;
  let fakeMeal: FakeMeal;

  beforeEach(async () => {
    repo = new MemoryDaysRepo();
    fakeMeal = FakeMeal.create(vp.validFakeMealProps);

    day = Day.create({
      ...vp.validDayProps,
      meals: [fakeMeal],
    });

    await repo.saveDay(day);
  });

  it('should save a day', async () => {
    const newDay = Day.create({
      ...vp.validDayProps,
      id: new Date('2023-10-02'),
      meals: [fakeMeal],
    });
    await repo.saveDay(newDay);

    const allDays = await repo.getAllDays();
    expect(allDays.length).toBe(2);
    expect(allDays[1].id).toEqual(new Date('2023-10-02'));
  });

  it('should update an existing day', async () => {
    const updatedDay = Day.create({
      ...vp.validDayProps,
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
});
