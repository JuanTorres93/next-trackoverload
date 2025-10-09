import { describe, it, expect, beforeEach } from 'vitest';
import { GetFakeMealByIdForUserUsecase } from '../GetFakeMealByIdForUser.usecase';
import { MemoryFakeMealsRepo } from '@/infra/memory/MemoryFakeMealsRepo';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { ValidationError } from '@/domain/common/errors';

describe('GetFakeMealByIdUsecase', () => {
  let usecase: GetFakeMealByIdForUserUsecase;
  let fakeMealsRepo: MemoryFakeMealsRepo;

  beforeEach(() => {
    fakeMealsRepo = new MemoryFakeMealsRepo();
    usecase = new GetFakeMealByIdForUserUsecase(fakeMealsRepo);
  });

  it('should return fake meal when found for correct user', async () => {
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

    const result = await usecase.execute({ id: 'test-id', userId: 'user-1' });

    expect(result).toBeDefined();
    expect(result?.id).toBe('test-id');
    expect(result?.userId).toBe('user-1');
    expect(result?.name).toBe('Test Fake Meal');
    expect(result?.calories).toBe(500);
    expect(result?.protein).toBe(30);
  });

  it('should return null when fake meal not found', async () => {
    const result = await usecase.execute({
      id: 'non-existent-id',
      userId: 'user-1',
    });

    expect(result).toBeNull();
  });

  it('should return null when fake meal belongs to different user', async () => {
    const fakeMeal = FakeMeal.create({
      id: 'test-id',
      userId: 'user-2',
      name: 'Test Fake Meal',
      calories: 500,
      protein: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal);

    const result = await usecase.execute({ id: 'test-id', userId: 'user-1' });

    expect(result).toBeNull();
  });

  it('should throw ValidationError for invalid id', async () => {
    const invalidIds = ['', '   '];
    for (const id of invalidIds) {
      await expect(usecase.execute({ id, userId: 'user-1' })).rejects.toThrow(
        ValidationError
      );
    }
  });

  it('should throw ValidationError for invalid userId', async () => {
    const invalidUserIds = ['', '   '];
    for (const userId of invalidUserIds) {
      await expect(usecase.execute({ id: 'test-id', userId })).rejects.toThrow(
        ValidationError
      );
    }
  });
});
