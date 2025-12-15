import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { toUserDTO } from '@/application-layer/dtos/UserDTO';
import { User } from '@/domain/entities/user/User';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetAllUsersUsecase } from '../GetAllUsers.usecase';

describe('GetAllUsersUsecase', () => {
  let usersRepo: MemoryUsersRepo;
  let getAllUsersUsecase: GetAllUsersUsecase;

  beforeEach(() => {
    usersRepo = new MemoryUsersRepo();
    getAllUsersUsecase = new GetAllUsersUsecase(usersRepo);
  });

  describe('Execute', () => {
    it('should return all users', async () => {
      const user1 = User.create({
        ...vp.validUserProps,
        name: 'User One',
      });

      const user2 = User.create({
        ...vp.validUserProps,
        id: 'another-user-id',
        name: 'User Two',
      });

      await usersRepo.saveUser(user1);
      await usersRepo.saveUser(user2);

      const result = await getAllUsersUsecase.execute();

      expect(result).toHaveLength(2);
      expect(result).toContainEqual(toUserDTO(user1));
      expect(result).toContainEqual(toUserDTO(user2));
    });

    it('should return array of UserDTO', async () => {
      const user1 = User.create({
        ...vp.validUserProps,
        name: 'User One',
      });

      const user2 = User.create({
        ...vp.validUserProps,
        id: 'another-user-id',
        name: 'User Two',
      });

      await usersRepo.saveUser(user1);
      await usersRepo.saveUser(user2);

      const result = await getAllUsersUsecase.execute();

      for (const user of result) {
        expect(user).not.toBeInstanceOf(User);
        for (const prop of dto.userDTOProperties) {
          expect(user).toHaveProperty(prop);
        }
      }
    });

    it('should return empty array when no users exist', async () => {
      const result = await getAllUsersUsecase.execute();

      expect(result).toEqual([]);
    });
  });
});
