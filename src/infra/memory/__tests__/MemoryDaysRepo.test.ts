import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryDaysRepo } from '../MemoryDaysRepo';
import { Day } from '@/domain/entities/day/Day';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';

const validFakeMealProps = {
  id: 'fakemeal1',
  name: 'Protein Shake',
  protein: 30,
  calories: 200,
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
};

describe('MemoryDaysRepo', () => {
  let repo: MemoryDaysRepo;
  let day: Day;
  let fakeMeal: FakeMeal;

  beforeEach(async () => {
    repo = new MemoryDaysRepo();
    fakeMeal = FakeMeal.create(validFakeMealProps);

    day = Day.create({
      id: new Date('2023-10-01'),
      meals: [fakeMeal],
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    });

    await repo.saveDay(day);
  });

  it('should save a day', async () => {
    const newDay = Day.create({
      id: new Date('2023-10-02'),
      meals: [fakeMeal],
      createdAt: new Date('2023-01-02'),
      updatedAt: new Date('2023-01-02'),
    });
    await repo.saveDay(newDay);

    const allDays = await repo.getAllDays();
    expect(allDays.length).toBe(2);
    expect(allDays[1].id).toEqual(new Date('2023-10-02'));
  });

  it('should update an existing day', async () => {
    const updatedDay = Day.create({
      id: new Date('2023-10-01'),
      meals: [], // No meals
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-03'),
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
