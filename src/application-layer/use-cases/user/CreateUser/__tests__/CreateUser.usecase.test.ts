import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { toUserDTO, UserDTO } from '@/application-layer/dtos/UserDTO';
import { AlreadyExistsError } from '@/domain/common/errors';
import { User } from '@/domain/entities/user/User';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreateUserUsecase } from '../CreateUser.usecase';

describe('CreateUserUsecase', () => {
  let usersRepo: MemoryUsersRepo;
  let createUserUsecase: CreateUserUsecase;
  let user: UserDTO;

  beforeEach(async () => {
    usersRepo = new MemoryUsersRepo();
    createUserUsecase = new CreateUserUsecase(usersRepo);
    user = await createUserUsecase.execute({
      name: vp.validUserProps.name,
      email: vp.validUserProps.email,
    });
  });

  describe('Execute', () => {
    it('should create user', async () => {
      expect(user.name).toBe(vp.validUserProps.name);
      expect(user.email).toBe(vp.validUserProps.email);
      expect(user.id).toBeDefined();
      expect(user.customerId).toBeUndefined();
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it('should save user to repo', async () => {
      const savedUser = await usersRepo.getUserById(user.id);

      expect(toUserDTO(savedUser!)).toEqual(user);
    });

    it('should return UserDTO', async () => {
      expect(user).not.toBeInstanceOf(User);

      for (const prop of dto.userDTOProperties) {
        expect(user).toHaveProperty(prop);
      }
    });

    it('should create user with customerId', async () => {
      const result = await createUserUsecase.execute({
        name: 'Jane Doe',
        email: 'janedoe@example.com',
        customerId: 'customer-123',
      });

      expect(result.customerId).toBe('customer-123');
    });

    it('should generate unique IDs for different users', async () => {
      const user2 = await createUserUsecase.execute({
        name: 'User Two',
        email: 'usertwo@example.com',
      });

      expect(user.id).not.toBe(user2.id);
    });
  });

  describe('Errors', () => {
    it('should throw error if email already exists', async () => {
      const request = {
        name: 'Duplicate Email User',
        email: vp.validUserProps.email,
      };

      await expect(createUserUsecase.execute(request)).rejects.toThrow(
        AlreadyExistsError
      );

      await expect(createUserUsecase.execute(request)).rejects.toThrow(
        /CreateUserUsecase.*User.*email.*already exists/
      );
    });

    it('should throw error for same email with different case', async () => {
      const request = {
        name: 'Duplicate Email User',
        email: vp.validUserProps.email.toUpperCase(),
      };

      await expect(createUserUsecase.execute(request)).rejects.toThrow(
        AlreadyExistsError
      );

      await expect(createUserUsecase.execute(request)).rejects.toThrow(
        /CreateUserUsecase.*User.*email.*already exists/
      );
    });

    it('should throw error if customer id already exists', async () => {
      // Create first user with customerId
      await createUserUsecase.execute({
        name: 'First User',
        email: 'firstuser@example.com',
        customerId: 'customer-123',
      });

      // Attempt to create second user with same customerId
      const request = {
        name: 'Second User',
        email: 'seconduser@example.com',
        customerId: 'customer-123',
      };

      await expect(createUserUsecase.execute(request)).rejects.toThrow(
        AlreadyExistsError
      );

      await expect(createUserUsecase.execute(request)).rejects.toThrow(
        /CreateUserUsecase.*User.*customerId.*already exists/
      );
    });
  });
});
