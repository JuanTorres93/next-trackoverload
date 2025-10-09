import { describe, it, expect, beforeEach } from 'vitest';
import { GetAllFakeMealsForUserUsecase } from '../GetAllFakeMealsForUser.usecase';
import { MemoryFakeMealsRepo } from '@/infra/memory/MemoryFakeMealsRepo';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { ValidationError } from '@/domain/common/errors';

describe('GetAllFakeMealsUsecase', () => {
  let usecase: GetAllFakeMealsForUserUsecase;
  let fakeMealsRepo: MemoryFakeMealsRepo;

  beforeEach(() => {
    fakeMealsRepo = new MemoryFakeMealsRepo();
    usecase = new GetAllFakeMealsForUserUsecase(fakeMealsRepo);
  });

  it('should return empty array when no fake meals exist', async () => {
    const result = await usecase.execute({ userId: 'user-1' });

    expect(result).toEqual([]);
  });

  it('should return all fake meals for a specific user', async () => {
    const fakeMeal1 = FakeMeal.create({
      id: 'test-id-1',
      userId: 'user-1',
      name: 'Test Fake Meal 1',
      calories: 500,
      protein: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const fakeMeal2 = FakeMeal.create({
      id: 'test-id-2',
      userId: 'user-1',
      name: 'Test Fake Meal 2',
      calories: 300,
      protein: 20,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const fakeMeal3 = FakeMeal.create({
      id: 'test-id-3',
      userId: 'user-2',
      name: 'Test Fake Meal 3',
      calories: 400,
      protein: 25,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal1);
    await fakeMealsRepo.saveFakeMeal(fakeMeal2);
    await fakeMealsRepo.saveFakeMeal(fakeMeal3);

    const result = await usecase.execute({ userId: 'user-1' });

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Test Fake Meal 1');
    expect(result[1].name).toBe('Test Fake Meal 2');
    expect(result.every((fm) => fm.userId === 'user-1')).toBe(true);
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
