import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { NotFoundError } from '@/domain/common/errors';
import { User } from '@/domain/entities/user/User';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateUserUsecase } from '../UpdateUser.usecase';

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

  it('should return UserDTO', async () => {
    const user = User.create({
      ...vp.validUserProps,
      name: 'Old Name',
    });

    await usersRepo.saveUser(user);

    const result = await updateUserUsecase.execute({
      id: vp.userId,
      patch: { name: 'New Name' },
    });

    for (const prop of dto.userDTOProperties) {
      expect(result).not.toBeInstanceOf(User);
      expect(result).toHaveProperty(prop);
    }
  });

  it('should throw NotFoundError when user does not exist', async () => {
    await expect(
      updateUserUsecase.execute({
        id: 'non-existent',
        patch: { name: 'Test' },
      })
    ).rejects.toThrow(NotFoundError);
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
});
