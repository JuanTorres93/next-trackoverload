import { beforeEach, describe, expect, it } from 'vitest';

import {
  createTestUser,
  securePassword,
  userTestCreateProps,
} from '@/../tests/createEntitiesTest/userCreate';
import { userDTOProperties } from '@/../tests/dtoProperties/userDtoProperties';
import { AlreadyExistsApplicationError } from '@/application-layer/common/applicationErrors';
import { User } from '@/domain/entities/user/User';
import { MemoryUsersRepo } from '@/infra/repos/Memory/MemoryUsersRepo';
import { CryptoUUIDIdGenerator } from '@/infra/services/CryptoUUIDIdGenerator/CryptoUUIDIdGenerator';
import { DummyPasswordHasher } from '@/infra/services/PasswordHasher/DummyPasswordHasher/DummyPasswordHasher';

import { CreateUserUsecase } from '../CreateUserUsecase';

describe('CreateUserUsecase', () => {
  let usersRepo: MemoryUsersRepo;
  let usecase: CreateUserUsecase;
  let user: User;

  beforeEach(async () => {
    usersRepo = new MemoryUsersRepo();
    const idGenerator = new CryptoUUIDIdGenerator();
    const passwordHasher = new DummyPasswordHasher();

    usecase = new CreateUserUsecase(usersRepo, idGenerator, passwordHasher);

    user = createTestUser();
    await usersRepo.save(user);
  });

  describe('Execution', () => {
    it('should return UserDTO', async () => {
      const result = await usecase.execute({
        email: 'newuser@example.com',
        plainPassword: securePassword,
      });

      expect(result).not.toBeInstanceOf(User);

      for (const prop of userDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });

    it('should hash password', async () => {
      const request = {
        email: userTestCreateProps.email,
        plainPassword: securePassword,
      };

      const savedUser = await usersRepo.getByEmail(request.email);

      expect(savedUser!.hashedPassword).not.toBe(request.plainPassword);
    });

    it('should generate different ids for different users', async () => {
      const request1 = {
        email: 'user1@example.com',
        plainPassword: securePassword,
      };

      const request2 = {
        email: 'user2@example.com',
        plainPassword: securePassword,
      };

      const user1 = await usecase.execute(request1);
      const user2 = await usecase.execute(request2);

      expect(user1.id).not.toBe(user2.id);
    });
  });

  describe('Side effects', () => {
    it('should persist user in the repository', async () => {
      const request = {
        email: 'newuser@example.com',
        plainPassword: securePassword,
      };

      await usecase.execute(request);

      const persistedUser = await usersRepo.getByEmail(request.email);

      expect(persistedUser).not.toBeNull();
    });
  });

  describe('Errors', () => {
    it('should throw error if user with that email already exists', async () => {
      const invalidRequest = {
        email: 'email@duplicated.com',
        plainPassword: securePassword,
      };

      await usecase.execute(invalidRequest);

      await expect(usecase.execute(invalidRequest)).rejects.toThrow(AlreadyExistsApplicationError);
    });
  });
});
