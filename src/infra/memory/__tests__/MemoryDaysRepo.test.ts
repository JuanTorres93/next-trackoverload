import * as vp from '@/../tests/createProps';
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
    fakeMeal = FakeMeal.create(vp.validFakeMealProps);

    day = Day.create({
      ...vp.validDayProps(),
    });

    day.addFakeMeal(fakeMeal.id);

    await repo.saveDay(day);
  });

  it('should save a day', async () => {
    const newDay = Day.create({
      ...vp.validDayProps(),
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
    const updatedDay = Day.create({
      ...vp.validDayProps(),
    });
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

    await repo.deleteDayForUser('20231001', vp.userId);
    const allDaysAfterDeletion = await repo.getAllDays();
    expect(allDaysAfterDeletion.length).toBe(0);
  });
});
