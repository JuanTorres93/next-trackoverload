import { beforeEach, describe, expect, it } from 'vitest';
import { CreateDayUsecase } from '../CreateDay.usecase';
import { MemoryDaysRepo } from '@/infra/memory/MemoryDaysRepo';
import { ValidationError } from '@/domain/common/errors';

describe('CreateDayUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let createDayUsecase: CreateDayUsecase;

  beforeEach(() => {
    daysRepo = new MemoryDaysRepo();
    createDayUsecase = new CreateDayUsecase(daysRepo);
  });

  it('should create and save a new day', async () => {
    const request = { date: new Date('2023-10-01') };

    const day = await createDayUsecase.execute(request);

    expect(day.id).toEqual(request.date);
    expect(day.meals).toEqual([]);
    expect(day.calories).toBe(0);
    expect(day.protein).toBe(0);
    expect(day).toHaveProperty('createdAt');
    expect(day).toHaveProperty('updatedAt');

    const savedDay = await daysRepo.getDayById(day.id.toISOString());
    expect(savedDay).toEqual(day);
  });

  it('should create a day with initial meals', async () => {
    const request = {
      date: new Date('2023-10-01'),
      meals: [],
    };

    const day = await createDayUsecase.execute(request);

    expect(day.id).toEqual(request.date);
    expect(day.meals).toEqual([]);
  });

  it('should throw an error if date is invalid', async () => {
    const request = { date: new Date('invalid') };

    await expect(createDayUsecase.execute(request)).rejects.toThrow(
      ValidationError
    );
  });

  it('should throw an error if meals are invalid', async () => {
    const invalidMeals = [{}, 3, 'invalid', { id: 'not-a-meal' }, null, 42];

    await Promise.all(
      invalidMeals.map((invalidMeal) =>
        expect(
          createDayUsecase.execute({
            date: new Date('2023-10-01'),
            // @ts-expect-error Testing invalid inputs
            meals: [invalidMeal],
          })
        ).rejects.toThrow(ValidationError)
      )
    );
  });
});
