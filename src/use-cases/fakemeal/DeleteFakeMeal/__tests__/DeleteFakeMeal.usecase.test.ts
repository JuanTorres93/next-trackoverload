import { describe, it, expect, beforeEach } from 'vitest';
import { DeleteFakeMealUsecase } from '../DeleteFakeMeal.usecase';
import { MemoryFakeMealsRepo } from '@/infra/memory/MemoryFakeMealsRepo';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { ValidationError, NotFoundError } from '@/domain/common/errors';

describe('DeleteFakeMealUsecase', () => {
  let usecase: DeleteFakeMealUsecase;
  let fakeMealsRepo: MemoryFakeMealsRepo;

  beforeEach(() => {
    fakeMealsRepo = new MemoryFakeMealsRepo();
    usecase = new DeleteFakeMealUsecase(fakeMealsRepo);
  });

  it('should delete fake meal successfully', async () => {
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

    // Verify fake meal exists before deletion
    const beforeDeletion = await fakeMealsRepo.getFakeMealByIdAndUserId(
      'test-id',
      'user-1'
    );
    expect(beforeDeletion).toBeDefined();

    await usecase.execute({ id: 'test-id', userId: 'user-1' });

    // Verify fake meal is deleted
    const afterDeletion = await fakeMealsRepo.getFakeMealByIdAndUserId(
      'test-id',
      'user-1'
    );
    expect(afterDeletion).toBeNull();
  });

  it('should throw NotFoundError when fake meal does not exist', async () => {
    await expect(
      usecase.execute({ id: 'non-existent-id', userId: 'user-1' })
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw ValidationError for invalid id', async () => {
    const invalidIds = ['', '   '];
    for (const id of invalidIds) {
      await expect(usecase.execute({ id, userId: 'user-1' })).rejects.toThrow(
        ValidationError
      );
    }
  });

  it('should not affect other fake meals when deleting one', async () => {
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

    await usecase.execute({ id: 'test-id-1', userId: 'user-1' });

    // Verify only the first fake meal is deleted
    const deletedFakeMeal = await fakeMealsRepo.getFakeMealByIdAndUserId(
      'test-id-1',
      'user-1'
    );
    const remainingFakeMeal = await fakeMealsRepo.getFakeMealByIdAndUserId(
      'test-id-2',
      'user-1'
    );

    expect(deletedFakeMeal).toBeNull();
    expect(remainingFakeMeal).toBeDefined();
    expect(remainingFakeMeal?.name).toBe('Test Fake Meal 2');
  });

  it('should throw error for invalid userId', async () => {
    const invalidUserIds = ['', '   ', null, undefined, 34, 0, -5, {}, []];
    for (const userId of invalidUserIds) {
      await expect(
        // @ts-expect-error testing invalid types
        usecase.execute({ id: 'test-id', userId })
      ).rejects.toThrow(ValidationError);
    }
  });
});
