import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { ValidationError } from '@/domain/common/errors';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { MemoryFakeMealsRepo } from '@/infra/memory/MemoryFakeMealsRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetAllFakeMealsForUserUsecase } from '../GetAllFakeMealsForUser.usecase';

describe('GetAllFakeMealsUsecase', () => {
  let usecase: GetAllFakeMealsForUserUsecase;
  let fakeMealsRepo: MemoryFakeMealsRepo;

  beforeEach(() => {
    fakeMealsRepo = new MemoryFakeMealsRepo();
    usecase = new GetAllFakeMealsForUserUsecase(fakeMealsRepo);
  });

  it('should return empty array when no fake meals exist', async () => {
    const result = await usecase.execute({ userId: vp.userId });

    expect(result).toEqual([]);
  });

  it('should return all fake meals for a specific user', async () => {
    const fakeMeal1 = FakeMeal.create({
      ...vp.validFakeMealProps,
      id: 'test-id-1',
      name: 'Test Fake Meal 1',
      calories: 500,
      protein: 30,
    });

    const fakeMeal2 = FakeMeal.create({
      ...vp.validFakeMealProps,
      id: 'test-id-2',
      name: 'Test Fake Meal 2',
      calories: 300,
      protein: 20,
    });

    const fakeMeal3 = FakeMeal.create({
      ...vp.validFakeMealProps,
      id: 'test-id-3',
      userId: 'user-2',
      name: 'Test Fake Meal 3',
      calories: 400,
      protein: 25,
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal1);
    await fakeMealsRepo.saveFakeMeal(fakeMeal2);
    await fakeMealsRepo.saveFakeMeal(fakeMeal3);

    const result = await usecase.execute({ userId: vp.userId });

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Test Fake Meal 1');
    expect(result[1].name).toBe('Test Fake Meal 2');
    expect(result.every((fm) => fm.userId === 'user-1')).toBe(true);
  });

  it('should return array of FakeMealDTO', async () => {
    const fakeMeal = FakeMeal.create({
      ...vp.validFakeMealProps,
      name: 'Test Fake Meal 1',
      calories: 500,
      protein: 30,
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal);

    const result = await usecase.execute({ userId: vp.userId });

    expect(result).toHaveLength(1);
    const returnedFakeMeal = result[0];

    expect(returnedFakeMeal).not.toBeInstanceOf(FakeMeal);
    for (const prop of dto.fakeMealDTOProperties) {
      expect(returnedFakeMeal).toHaveProperty(prop);
    }

    expect(returnedFakeMeal.id).toBe(fakeMeal.id);
    expect(returnedFakeMeal.userId).toBe(fakeMeal.userId);
    expect(returnedFakeMeal.name).toBe(fakeMeal.name);
    expect(returnedFakeMeal.calories).toBe(fakeMeal.calories);
    expect(returnedFakeMeal.protein).toBe(fakeMeal.protein);
  });

  it('should throw error for invalid userId', async () => {
    const invalidUserIds = ['', '   ', null, undefined, 34, 0, -5, {}, []];
    for (const userId of invalidUserIds) {
      await expect(
        // @ts-expect-error testing invalid types
        usecase.execute({ userId })
      ).rejects.toThrow(ValidationError);
    }
  });
});
