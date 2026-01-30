import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import * as dto from '@/../tests/dtoProperties';
import { toUserDTO } from '@/application-layer/dtos/UserDTO';
import { User } from '@/domain/entities/user/User';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetUserByIdUsecase } from '../GetUserById.usecase';
import { PermissionError } from '@/domain/common/errors';

describe('GetUserByIdUsecase', () => {
  let usersRepo: MemoryUsersRepo;
  let getUserByIdUsecase: GetUserByIdUsecase;

  beforeEach(() => {
    usersRepo = new MemoryUsersRepo();
    getUserByIdUsecase = new GetUserByIdUsecase(usersRepo);
  });

  describe('Execute', () => {
    it('should return user when found', async () => {
      const user = User.create({
        ...userTestProps.validUserProps,
      });

      await usersRepo.saveUser(user);

      const result = await getUserByIdUsecase.execute({
        actorUserId: userTestProps.validUserProps.id,
        targetUserId: userTestProps.validUserProps.id,
      });

      expect(result).toEqual(toUserDTO(user));
    });

    it('should return user DTO when found', async () => {
      const user = User.create({
        ...userTestProps.validUserProps,
      });

      await usersRepo.saveUser(user);

      const result = await getUserByIdUsecase.execute({
        actorUserId: userTestProps.validUserProps.id,
        targetUserId: userTestProps.validUserProps.id,
      });

      for (const prop of dto.userDTOProperties) {
        expect(result).not.toBeInstanceOf(User);
        expect(result).toHaveProperty(prop);
      }
    });

    it('should return null when user not found', async () => {
      const result = await getUserByIdUsecase.execute({
        actorUserId: 'non-existent',
        targetUserId: 'non-existent',
      });

      expect(result).toBeNull();
    });
  });

  describe('Errors', () => {
    it('should throw error if trying to get another user', async () => {
      const request = {
        actorUserId: 'actor-id',
        targetUserId: 'target-id',
      };

      await expect(() =>
        getUserByIdUsecase.execute(request),
      ).rejects.toThrowError(PermissionError);

      await expect(() =>
        getUserByIdUsecase.execute(request),
      ).rejects.toThrowError(/GetUserByIdUsecase.*Access denied/);
    });
  });
});
