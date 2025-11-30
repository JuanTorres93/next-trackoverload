import * as vp from '@/../tests/createProps';
import { NotFoundError } from '@/domain/common/errors';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { User } from '@/domain/entities/user/User';
import { MemoryFakeMealsRepo } from '@/infra/memory/MemoryFakeMealsRepo';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { DeleteFakeMealUsecase } from '../DeleteFakeMeal.usecase';

describe('DeleteFakeMealUsecase', () => {
  let usecase: DeleteFakeMealUsecase;
  let fakeMealsRepo: MemoryFakeMealsRepo;
  let usersRepo: MemoryUsersRepo;
  let user: User;

  beforeEach(async () => {
    fakeMealsRepo = new MemoryFakeMealsRepo();
    usersRepo = new MemoryUsersRepo();
    usecase = new DeleteFakeMealUsecase(fakeMealsRepo, usersRepo);

    user = User.create({
      ...vp.validUserProps,
    });

    await usersRepo.saveUser(user);
  });

  it('should delete fake meal successfully', async () => {
    const fakeMeal = FakeMeal.create({
      ...vp.validFakeMealProps,
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal);

    // Verify fake meal exists before deletion
    const beforeDeletion = await fakeMealsRepo.getFakeMealByIdAndUserId(
      vp.validFakeMealProps.id,
      vp.userId
    );
    expect(beforeDeletion).toBeDefined();

    await usecase.execute({ id: vp.validFakeMealProps.id, userId: vp.userId });

    // Verify fake meal is deleted
    const afterDeletion = await fakeMealsRepo.getFakeMealByIdAndUserId(
      vp.validFakeMealProps.id,
      vp.userId
    );
    expect(afterDeletion).toBeNull();
  });

  it('should not affect other fake meals when deleting one', async () => {
    const fakeMeal1 = FakeMeal.create({
      ...vp.validFakeMealProps,
      id: 'test-id-1',
      name: 'Test Fake Meal 1',
    });

    const fakeMeal2 = FakeMeal.create({
      ...vp.validFakeMealProps,
      id: 'test-id-2',
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

  it('should throw error if not found meal', async () => {
    await expect(
      usecase.execute({ id: 'non-existent-id', userId: vp.userId })
    ).rejects.toThrow(NotFoundError);
    await expect(
      usecase.execute({ id: 'non-existent-id', userId: vp.userId })
    ).rejects.toThrow(/DeleteFakeMealUsecase.*FakeMeal.* not found/);
  });

  it('should throw error if user does not exist', async () => {
    await expect(
      usecase.execute({ id: 'some-id', userId: 'non-existent' })
    ).rejects.toThrow(NotFoundError);
    await expect(
      usecase.execute({ id: 'some-id', userId: 'non-existent' })
    ).rejects.toThrow(/DeleteFakeMealUsecase.*user.*not.*found/);
  });
});
