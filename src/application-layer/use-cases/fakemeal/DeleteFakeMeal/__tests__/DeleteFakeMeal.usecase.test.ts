import { describe, it, expect, beforeEach } from 'vitest';
import { DeleteFakeMealUsecase } from '../DeleteFakeMeal.usecase';
import { MemoryFakeMealsRepo } from '@/infra/memory/MemoryFakeMealsRepo';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { Id } from '@/domain/types/Id/Id';
import { ValidationError, NotFoundError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';

describe('DeleteFakeMealUsecase', () => {
  let usecase: DeleteFakeMealUsecase;
  let fakeMealsRepo: MemoryFakeMealsRepo;

  beforeEach(() => {
    fakeMealsRepo = new MemoryFakeMealsRepo();
    usecase = new DeleteFakeMealUsecase(fakeMealsRepo);
  });

  it('should delete fake meal successfully', async () => {
    const fakeMeal = FakeMeal.create({
      ...vp.validFakeMealProps,
      id: Id.create('test-id'),
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal);

    // Verify fake meal exists before deletion
    const beforeDeletion = await fakeMealsRepo.getFakeMealByIdAndUserId(
      'test-id',
      vp.userId
    );
    expect(beforeDeletion).toBeDefined();

    await usecase.execute({ id: 'test-id', userId: vp.userId });

    // Verify fake meal is deleted
    const afterDeletion = await fakeMealsRepo.getFakeMealByIdAndUserId(
      'test-id',
      vp.userId
    );
    expect(afterDeletion).toBeNull();
  });

  it('should throw NotFoundError when fake meal does not exist', async () => {
    await expect(
      usecase.execute({ id: 'non-existent-id', userId: vp.userId })
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw ValidationError for invalid id', async () => {
    const invalidIds = ['', '   '];
    for (const id of invalidIds) {
      await expect(usecase.execute({ id, userId: vp.userId })).rejects.toThrow(
        ValidationError
      );
    }
  });

  it('should not affect other fake meals when deleting one', async () => {
    const fakeMeal1 = FakeMeal.create({
      ...vp.validFakeMealProps,
      id: Id.create('test-id-1'),
      name: 'Test Fake Meal 1',
    });

    const fakeMeal2 = FakeMeal.create({
      ...vp.validFakeMealProps,
      id: Id.create('test-id-2'),
      name: 'Test Fake Meal 2',
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal1);
    await fakeMealsRepo.saveFakeMeal(fakeMeal2);

    await usecase.execute({ id: 'test-id-1', userId: vp.userId });

    // Verify only the first fake meal is deleted
    const deletedFakeMeal = await fakeMealsRepo.getFakeMealByIdAndUserId(
      'test-id-1',
      vp.userId
    );
    const remainingFakeMeal = await fakeMealsRepo.getFakeMealByIdAndUserId(
      'test-id-2',
      vp.userId
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
