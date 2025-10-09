import { describe, it, expect, beforeEach } from 'vitest';
import { GetFakeMealsByIdsForUserUsecase } from '../GetFakeMealsByIdsForUser.usecase';
import { MemoryFakeMealsRepo } from '@/infra/memory/MemoryFakeMealsRepo';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { ValidationError } from '@/domain/common/errors';

describe('GetFakeMealsByIdsUsecase', () => {
  let usecase: GetFakeMealsByIdsForUserUsecase;
  let fakeMealsRepo: MemoryFakeMealsRepo;

  beforeEach(() => {
    fakeMealsRepo = new MemoryFakeMealsRepo();
    usecase = new GetFakeMealsByIdsForUserUsecase(fakeMealsRepo);
  });

  it('should return fake meals for valid ids', async () => {
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

    await fakeMealsRepo.saveFakeMeal(fakeMeal1);
    await fakeMealsRepo.saveFakeMeal(fakeMeal2);

    const ids = ['test-id-1', 'test-id-2'];
    const result = await usecase.execute({ ids, userId: 'user-1' });

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Test Fake Meal 1');
    expect(result[1].name).toBe('Test Fake Meal 2');
  });

  it('should filter out non-existent fake meals', async () => {
    const fakeMeal1 = FakeMeal.create({
      id: 'test-id-1',
      userId: 'user-1',
      name: 'Test Fake Meal 1',
      calories: 500,
      protein: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal1);

    const ids = ['test-id-1', 'non-existent-id'];
    const result = await usecase.execute({ ids, userId: 'user-1' });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Test Fake Meal 1');
  });

  it('should return empty array when no fake meals found', async () => {
    const ids = ['non-existent-id-1', 'non-existent-id-2'];
    const result = await usecase.execute({ ids, userId: 'user-1' });

    expect(result).toEqual([]);
  });

  it('should handle duplicate ids', async () => {
    const fakeMeal = FakeMeal.create({
      id: 'test-id',
      userId: 'user-1',
      name: 'Test Fake Meal',
      calories: 500,
      protein: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal);

    const ids = ['test-id', 'test-id', 'test-id'];
    const result = await usecase.execute({ ids, userId: 'user-1' });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Test Fake Meal');
  });

  it('should throw ValidationError for non-array ids', async () => {
    await expect(
      usecase.execute({
        ids: 'not-an-array' as unknown as string[],
        userId: 'user-1',
      })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw ValidationError for empty array', async () => {
    await expect(
      usecase.execute({ ids: [], userId: 'user-1' })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw ValidationError for invalid id', async () => {
    const fakeMeal = FakeMeal.create({
      id: 'test-id',
      userId: 'user-1',
      name: 'Test Fake Meal',
      calories: 500,
      protein: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal);

    const invalidIds = ['', '   '];
    for (const id of invalidIds) {
      await expect(
        usecase.execute({ ids: [id], userId: 'user-1' })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw ValidationError for invalid userId', async () => {
    const invalidUserIds = ['', '   ', null, undefined, 34, 0, -5, {}, []];
    for (const userId of invalidUserIds) {
      await expect(
        // @ts-expect-error testing invalid types
        usecase.execute({ ids: ['test-id'], userId })
      ).rejects.toThrow(ValidationError);
    }
  });
});
