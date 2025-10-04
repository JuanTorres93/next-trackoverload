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
      name: 'Test Fake Meal',
      calories: 500,
      protein: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal);

    // Verify fake meal exists before deletion
    const beforeDeletion = await fakeMealsRepo.getFakeMealById('test-id');
    expect(beforeDeletion).toBeDefined();

    await usecase.execute({ id: 'test-id' });

    // Verify fake meal is deleted
    const afterDeletion = await fakeMealsRepo.getFakeMealById('test-id');
    expect(afterDeletion).toBeNull();
  });

  it('should throw NotFoundError when fake meal does not exist', async () => {
    await expect(usecase.execute({ id: 'non-existent-id' })).rejects.toThrow(
      NotFoundError
    );
  });

  it('should throw ValidationError for invalid id', async () => {
    const invalidIds = ['', '   ', null, 2, {}, []];
    for (const id of invalidIds) {
      // @ts-expect-error testing invalid types
      await expect(usecase.execute({ id })).rejects.toThrow(ValidationError);
    }
  });

  it('should not affect other fake meals when deleting one', async () => {
    const fakeMeal1 = FakeMeal.create({
      id: 'test-id-1',
      name: 'Test Fake Meal 1',
      calories: 500,
      protein: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const fakeMeal2 = FakeMeal.create({
      id: 'test-id-2',
      name: 'Test Fake Meal 2',
      calories: 300,
      protein: 20,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal1);
    await fakeMealsRepo.saveFakeMeal(fakeMeal2);

    await usecase.execute({ id: 'test-id-1' });

    // Verify only the first fake meal is deleted
    const deletedFakeMeal = await fakeMealsRepo.getFakeMealById('test-id-1');
    const remainingFakeMeal = await fakeMealsRepo.getFakeMealById('test-id-2');

    expect(deletedFakeMeal).toBeNull();
    expect(remainingFakeMeal).toBeDefined();
    expect(remainingFakeMeal?.name).toBe('Test Fake Meal 2');
  });
});
