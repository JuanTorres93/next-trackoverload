import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateUserUsecase } from '../UpdateUser.usecase';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { User } from '@/domain/entities/user/User';
import { ValidationError, NotFoundError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';

describe('UpdateUserUsecase', () => {
  let usersRepo: MemoryUsersRepo;
  let updateUserUsecase: UpdateUserUsecase;

  beforeEach(() => {
    usersRepo = new MemoryUsersRepo();
    updateUserUsecase = new UpdateUserUsecase(usersRepo);
  });

  it('should update user name successfully', async () => {
    const user = User.create({
      ...vp.validUserProps,
      name: 'Old Name',
    });

    await usersRepo.saveUser(user);

    const result = await updateUserUsecase.execute({
      id: vp.userId,
      patch: { name: 'New Name' },
    });

    expect(result.name).toBe('New Name');
    expect(result.id).toBe(vp.userId);
    expect(result.customerId).toBe(user.customerId);
  });

  it('should return existing user when no changes made', async () => {
    const user = User.create({
      ...vp.validUserProps,
      name: 'Test Name',
    });

    await usersRepo.saveUser(user);

    const result = await updateUserUsecase.execute({
      id: vp.userId,
    });

    expect(result.name).toBe('Test Name');
    expect(result.id).toBe(vp.userId);
  });

  it('should throw NotFoundError when user does not exist', async () => {
    await expect(
      updateUserUsecase.execute({
        id: 'non-existent',
        patch: { name: 'Test' },
      })
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw ValidationError when id is invalid', async () => {
    const invalidIds = [true, 4, null, undefined];

    for (const invalidId of invalidIds) {
      await expect(
        // @ts-expect-error Testing invalid inputs
        updateUserUsecase.execute({ id: invalidId, name: 'Test' })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should update user and persist changes', async () => {
    const user = User.create({
      ...vp.validUserProps,
      name: 'Original Name',
    });

    await usersRepo.saveUser(user);

    await updateUserUsecase.execute({
      id: vp.userId,
      patch: { name: 'Updated Name' },
    });

    // Verify the change was persisted
    const persistedUser = await usersRepo.getUserById(vp.userId);
    expect(persistedUser?.name).toBe('Updated Name');
  });

  it('should throw error if patch is not an object', async () => {
    const invalidPatches = [null, 123, 'string', true, []];

    for (const invalidPatch of invalidPatches) {
      await expect(
        updateUserUsecase.execute({
          id: vp.userId,
          // @ts-expect-error Testing invalid types
          patch: invalidPatch,
        })
      ).rejects.toThrow(ValidationError);
    }
  });
});
