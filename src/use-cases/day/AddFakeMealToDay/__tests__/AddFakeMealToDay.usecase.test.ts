import { beforeEach, describe, expect, it } from 'vitest';
import { AddFakeMealToDayUsecase } from '../AddFakeMealToDay.usecase';
import { MemoryDaysRepo } from '@/infra/memory/MemoryDaysRepo';
import { MemoryFakeMealsRepo } from '@/infra/memory/MemoryFakeMealsRepo';
import { Day } from '@/domain/entities/day/Day';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { ValidationError } from '@/domain/common/errors';

describe('AddFakeMealToDayUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let fakeMealsRepo: MemoryFakeMealsRepo;
  let addFakeMealToDayUsecase: AddFakeMealToDayUsecase;

  beforeEach(() => {
    daysRepo = new MemoryDaysRepo();
    fakeMealsRepo = new MemoryFakeMealsRepo();
    addFakeMealToDayUsecase = new AddFakeMealToDayUsecase(
      daysRepo,
      fakeMealsRepo
    );
  });

  it('should add fake meal to existing day', async () => {
    const date = new Date('2023-10-01');
    const day = Day.create({
      id: date,
      meals: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const fakeMeal = FakeMeal.create({
      id: 'fake-meal-1',
      name: 'Quick Snack',
      calories: 200,
      protein: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await daysRepo.saveDay(day);
    await fakeMealsRepo.saveFakeMeal(fakeMeal);

    const result = await addFakeMealToDayUsecase.execute({
      date,
      fakeMealId: 'fake-meal-1',
    });

    expect(result.meals).toHaveLength(1);
    expect(result.meals[0]).toEqual(fakeMeal);
  });

  it('should add fake meal and create new day if it does not exist', async () => {
    const date = new Date('2023-10-01');
    const fakeMeal = FakeMeal.create({
      id: 'fake-meal-1',
      name: 'Quick Snack',
      calories: 200,
      protein: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal);

    const result = await addFakeMealToDayUsecase.execute({
      date,
      fakeMealId: 'fake-meal-1',
    });

    expect(result.id).toEqual(date);
    expect(result.meals).toHaveLength(1);
    expect(result.meals[0]).toEqual(fakeMeal);
  });

  it('should throw error if fake meal does not exist', async () => {
    const date = new Date('2023-10-01');

    await expect(
      addFakeMealToDayUsecase.execute({ date, fakeMealId: 'non-existent' })
    ).rejects.toThrow(ValidationError);
  });
});
