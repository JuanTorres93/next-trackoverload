import { beforeEach, describe, expect, it } from 'vitest';
import { AddFakeMealToDayUsecase } from '../AddFakeMealToDay.usecase';
import { MemoryDaysRepo } from '@/infra/memory/MemoryDaysRepo';
import { MemoryFakeMealsRepo } from '@/infra/memory/MemoryFakeMealsRepo';
import { Day } from '@/domain/entities/day/Day';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { ValidationError } from '@/domain/common/errors';

import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';

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
    const userId = 'user-1';
    const day = Day.create({
      ...vp.validDayProps,
    });
    const fakeMeal = FakeMeal.create({
      ...vp.validFakeMealProps,
    });

    await daysRepo.saveDay(day);
    await fakeMealsRepo.saveFakeMeal(fakeMeal);

    const result = await addFakeMealToDayUsecase.execute({
      date,
      userId,
      fakeMealId: fakeMeal.id,
    });

    expect(result.meals).toHaveLength(1);
    expect(result.meals[0].id).toEqual(fakeMeal.id);
  });

  it('should return DayDTO', async () => {
    const date = new Date('2023-10-01');
    const userId = 'user-1';
    const day = Day.create({
      ...vp.validDayProps,
    });
    const fakeMeal = FakeMeal.create({
      ...vp.validFakeMealProps,
    });

    await daysRepo.saveDay(day);
    await fakeMealsRepo.saveFakeMeal(fakeMeal);

    const result = await addFakeMealToDayUsecase.execute({
      date,
      userId,
      fakeMealId: fakeMeal.id,
    });

    expect(result).not.toBeInstanceOf(Day);
    for (const prop of dto.dayDTOProperties) {
      expect(result).toHaveProperty(prop);
    }
  });

  it('should add fake meal and create new day if it does not exist', async () => {
    const date = new Date('2023-10-01');
    const userId = 'user-1';
    const fakeMeal = FakeMeal.create({
      ...vp.validFakeMealProps,
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal);

    const result = await addFakeMealToDayUsecase.execute({
      date,
      userId,
      fakeMealId: fakeMeal.id,
    });

    expect(result.id).toEqual(date.toISOString());
    expect(result.meals).toHaveLength(1);
    expect(result.meals[0].id).toEqual(fakeMeal.id);
  });

  it('should throw error if fake meal does not exist', async () => {
    const date = new Date('2023-10-01');
    const userId = 'user-1';

    await expect(
      addFakeMealToDayUsecase.execute({
        date,
        userId,
        fakeMealId: 'non-existent',
      })
    ).rejects.toThrow(ValidationError);
  });
});
