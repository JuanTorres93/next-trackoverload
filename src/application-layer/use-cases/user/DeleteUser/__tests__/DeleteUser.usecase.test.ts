import { beforeEach, describe, expect, it } from 'vitest';
import { DeleteUserUsecase } from '../DeleteUser.usecase';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { User } from '@/domain/entities/user/User';
import { ValidationError, NotFoundError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';

describe('DeleteUserUsecase', () => {
  let usersRepo: MemoryUsersRepo;
  let deleteUserUsecase: DeleteUserUsecase;

  beforeEach(() => {
    usersRepo = new MemoryUsersRepo();
    deleteUserUsecase = new DeleteUserUsecase(usersRepo);
  });

  it('should delete user successfully', async () => {
    const user = User.create({
      ...vp.validUserProps,
      name: 'Test User',
    });

    await usersRepo.saveUser(user);

    // Verify user exists before deletion
    const existingUser = await usersRepo.getUserById(vp.userId);
    expect(existingUser).not.toBeNull();

    await deleteUserUsecase.execute({ id: vp.userId });

    // Verify user was deleted
    const deletedUser = await usersRepo.getUserById(vp.userId);
    expect(deletedUser).toBeNull();
  });

  it('should throw NotFoundError when user does not exist', async () => {
    await expect(
      deleteUserUsecase.execute({ id: 'non-existent' })
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw ValidationError when id is invalid', async () => {
    const invalidIds = [true, 4, null, undefined];

    for (const invalidId of invalidIds) {
      await expect(
        // @ts-expect-error Testing invalid inputs
        deleteUserUsecase.execute({ id: invalidId })
      ).rejects.toThrow(ValidationError);
    }
  });
});
