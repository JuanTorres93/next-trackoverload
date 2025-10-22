import { beforeEach, describe, expect, it } from 'vitest';
import { CreateDayUsecase } from '../CreateDay.usecase';
import { MemoryDaysRepo } from '@/infra/memory/MemoryDaysRepo';
import { ValidationError } from '@/domain/common/errors';
import { Day } from '@/domain/entities/day/Day';
import { toDayDTO } from '@/application-layer/dtos/DayDTO';
import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';

describe('CreateDayUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let createDayUsecase: CreateDayUsecase;

  beforeEach(() => {
    daysRepo = new MemoryDaysRepo();
    createDayUsecase = new CreateDayUsecase(daysRepo);
  });

  it('should create and save a new day', async () => {
    const request = { date: vp.dateId, userId: vp.userId };

    const day = await createDayUsecase.execute(request);

    expect(day.id).toEqual(request.date.toISOString());
    expect(day.meals).toEqual([]);
    expect(day.calories).toBe(0);
    expect(day.protein).toBe(0);
    expect(day).toHaveProperty('createdAt');
    expect(day).toHaveProperty('updatedAt');

    const savedDay = await daysRepo.getDayById(day.id);

    // @ts-expect-error savedDay won't be null
    expect(toDayDTO(savedDay)).toEqual(day);
  });

  it('should return DayDTO', async () => {
    const request = { date: vp.dateId, userId: vp.userId };

    const day = await createDayUsecase.execute(request);

    expect(day).not.toBeInstanceOf(Day);
    for (const prop of dto.dayDTOProperties) {
      expect(day).toHaveProperty(prop);
    }
  });

  it('should create a day with initial meals', async () => {
    const request = {
      date: vp.dateId,
      userId: vp.userId,
      meals: [],
    };

    const day = await createDayUsecase.execute(request);

    expect(day.id).toEqual(request.date.toISOString());
    expect(day.meals).toEqual([]);
  });

  it('should throw an error if date is invalid', async () => {
    const request = { date: new Date('invalid'), userId: vp.userId };

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
            date: vp.dateId,
            userId: vp.userId,
            // @ts-expect-error Testing invalid inputs
            meals: [invalidMeal],
          })
        ).rejects.toThrow(ValidationError)
      )
    );
  });
});
