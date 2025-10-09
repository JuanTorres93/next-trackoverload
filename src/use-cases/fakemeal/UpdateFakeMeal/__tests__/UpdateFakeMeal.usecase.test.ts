import { describe, it, expect, beforeEach } from 'vitest';
import { UpdateFakeMealUsecase } from '../UpdateFakeMeal.usecase';
import { MemoryFakeMealsRepo } from '@/infra/memory/MemoryFakeMealsRepo';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { ValidationError, NotFoundError } from '@/domain/common/errors';

describe('UpdateFakeMealUsecase', () => {
  let usecase: UpdateFakeMealUsecase;
  let fakeMealsRepo: MemoryFakeMealsRepo;

  beforeEach(() => {
    fakeMealsRepo = new MemoryFakeMealsRepo();
    usecase = new UpdateFakeMealUsecase(fakeMealsRepo);
  });

  it('should update fake meal name successfully', async () => {
    const fakeMeal = FakeMeal.create({
      id: 'test-id',
      userId: 'user-1',
      name: 'Original Name',
      calories: 500,
      protein: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal);

    const result = await usecase.execute({
      id: 'test-id',
      userId: 'user-1',
      patch: { name: 'Updated Name' },
    });

    expect(result.name).toBe('Updated Name');
    expect(result.calories).toBe(500);
    expect(result.protein).toBe(30);
  });

  it('should update fake meal calories successfully', async () => {
    const fakeMeal = FakeMeal.create({
      id: 'test-id',
      userId: 'user-1',
      name: 'Test Meal',
      calories: 500,
      protein: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal);

    const result = await usecase.execute({
      id: 'test-id',
      userId: 'user-1',
      patch: { calories: 600 },
    });

    expect(result.name).toBe('Test Meal');
    expect(result.calories).toBe(600);
    expect(result.protein).toBe(30);
  });

  it('should update fake meal protein successfully', async () => {
    const fakeMeal = FakeMeal.create({
      id: 'test-id',
      userId: 'user-1',
      name: 'Test Meal',
      calories: 500,
      protein: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal);

    const result = await usecase.execute({
      id: 'test-id',
      userId: 'user-1',
      patch: { protein: 40 },
    });

    expect(result.name).toBe('Test Meal');
    expect(result.calories).toBe(500);
    expect(result.protein).toBe(40);
  });

  it('should update multiple fields at once', async () => {
    const fakeMeal = FakeMeal.create({
      id: 'test-id',
      userId: 'user-1',
      name: 'Original Name',
      calories: 500,
      protein: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal);

    const result = await usecase.execute({
      id: 'test-id',
      userId: 'user-1',
      patch: {
        name: 'Updated Name',
        calories: 600,
        protein: 40,
      },
    });

    expect(result.name).toBe('Updated Name');
    expect(result.calories).toBe(600);
    expect(result.protein).toBe(40);
  });

  it('should throw NotFoundError when fake meal does not exist', async () => {
    await expect(
      usecase.execute({
        id: 'non-existent-id',
        userId: 'user-1',
        patch: { name: 'Updated Name' },
      })
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw ValidationError for empty id', async () => {
    await expect(
      usecase.execute({
        id: '',
        userId: 'user-1',
        patch: { name: 'Updated Name' },
      })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw ValidationError for invalid name in patch', async () => {
    const fakeMeal = FakeMeal.create({
      id: 'test-id',
      userId: 'user-1',
      name: 'Test Meal',
      calories: 500,
      protein: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal);

    await expect(
      usecase.execute({
        id: 'test-id',
        userId: 'user-1',
        patch: { name: '' },
      })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw ValidationError for invalid calories in patch', async () => {
    const fakeMeal = FakeMeal.create({
      id: 'test-id',
      userId: 'user-1',
      name: 'Test Meal',
      calories: 500,
      protein: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal);

    await expect(
      usecase.execute({
        id: 'test-id',
        userId: 'user-1',
        patch: { calories: 0 },
      })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw error for invalid userId', async () => {
    const invalidUserIds = ['', '   ', null, undefined, 34, 0, -5, {}, []];
    for (const userId of invalidUserIds) {
      await expect(
        // @ts-expect-error testing invalid types
        usecase.execute({ id: 'test-id', userId, patch: { name: 'Name' } })
      ).rejects.toThrow(ValidationError);
    }
  });
});
