import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import * as dto from '@/../tests/dtoProperties';
import { NotFoundError, PermissionError } from '@/domain/common/errors';
import { User } from '@/domain/entities/user/User';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateUserUsecase } from '../UpdateUser.usecase';

describe('UpdateUserUsecase', () => {
  let usersRepo: MemoryUsersRepo;
  let updateUserUsecase: UpdateUserUsecase;

  beforeEach(() => {
    usersRepo = new MemoryUsersRepo();
    updateUserUsecase = new UpdateUserUsecase(usersRepo);
  });

  describe('Execute', () => {
    it('should update user name successfully', async () => {
      const user = userTestProps.createTestUser();

      await usersRepo.saveUser(user);

      const result = await updateUserUsecase.execute({
        actorUserId: userTestProps.userId,
        targetUserId: userTestProps.userId,
        patch: { name: 'New Name' },
      });

      expect(result.name).toBe('New Name');
      expect(result.id).toBe(userTestProps.userId);
      expect(result.customerId).toBe(user.customerId);
    });

    it('should return UserDTO', async () => {
      const user = userTestProps.createTestUser();

      await usersRepo.saveUser(user);

      const result = await updateUserUsecase.execute({
        actorUserId: userTestProps.userId,
        targetUserId: userTestProps.userId,
        patch: { name: 'New Name' },
      });

      for (const prop of dto.userDTOProperties) {
        expect(result).not.toBeInstanceOf(User);
        expect(result).toHaveProperty(prop);
      }
    });

    it('should update user and persist changes', async () => {
      const user = userTestProps.createTestUser();

      await usersRepo.saveUser(user);

      await updateUserUsecase.execute({
        actorUserId: userTestProps.userId,
        targetUserId: userTestProps.userId,
        patch: { name: 'Updated Name' },
      });

      // Verify the change was persisted
      const persistedUser = await usersRepo.getUserById(userTestProps.userId);
      expect(persistedUser?.name).toBe('Updated Name');
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError when user does not exist', async () => {
      const request = {
        actorUserId: 'non-existent',
        targetUserId: 'non-existent',
        patch: { name: 'Test' },
      };

      await expect(updateUserUsecase.execute(request)).rejects.toThrow(
        NotFoundError,
      );

      await expect(updateUserUsecase.execute(request)).rejects.toThrow(
        /UpdateUserUsecase.*User.*not found/,
      );
    });

    it('should throw error if trying to update another user', async () => {
      const request = {
        actorUserId: 'actor-id',
        targetUserId: 'target-id',
        patch: { name: 'Test' },
      };

      await expect(updateUserUsecase.execute(request)).rejects.toThrow(
        PermissionError,
      );

      await expect(updateUserUsecase.execute(request)).rejects.toThrow(
        /UpdateUserUsecase.*Access denied/,
      );
    });
  });
});
