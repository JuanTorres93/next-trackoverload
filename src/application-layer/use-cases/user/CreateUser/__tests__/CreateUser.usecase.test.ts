import { beforeEach, describe, expect, it } from 'vitest';
import { CreateUserUsecase } from '../CreateUser.usecase';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { ValidationError } from '@/domain/common/errors';
import * as dto from '@/../tests/dtoProperties';
import { User } from '@/domain/entities/user/User';
import { toUserDTO } from '@/application-layer/dtos/UserDTO';

describe('CreateUserUsecase', () => {
  let usersRepo: MemoryUsersRepo;
  let createUserUsecase: CreateUserUsecase;

  beforeEach(() => {
    usersRepo = new MemoryUsersRepo();
    createUserUsecase = new CreateUserUsecase(usersRepo);
  });

  it('should create user with name only', async () => {
    const result = await createUserUsecase.execute({
      name: 'John Doe',
    });

    expect(result.name).toBe('John Doe');
    expect(result.id).toBeDefined();
    expect(result.customerId).toBeUndefined();
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();

    // Verify user was saved in repository
    const savedUser = await usersRepo.getUserById(result.id);

    // @ts-expect-error savedUser won't be null
    expect(toUserDTO(savedUser)).toEqual(result);
  });

  it('should return UserDTO', async () => {
    const result = await createUserUsecase.execute({
      name: 'John Doe',
    });

    expect(result).not.toBeInstanceOf(User);
    for (const prop of dto.userDTOProperties) {
      expect(result).toHaveProperty(prop);
    }
  });

  it('should create user with name and customerId', async () => {
    const result = await createUserUsecase.execute({
      name: 'Jane Doe',
      customerId: 'customer-123',
    });

    expect(result.name).toBe('Jane Doe');
    expect(result.customerId).toBe('customer-123');
    expect(result.id).toBeDefined();
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();

    // Verify user was saved in repository
    const savedUser = await usersRepo.getUserById(result.id);
    // @ts-expect-error savedUser won't be null
    expect(toUserDTO(savedUser)).toEqual(result);
  });

  it('should generate unique IDs for different users', async () => {
    const user1 = await createUserUsecase.execute({
      name: 'User One',
    });

    const user2 = await createUserUsecase.execute({
      name: 'User Two',
    });

    expect(user1.id).not.toBe(user2.id);
  });

  it('should throw ValidationError when name is invalid', async () => {
    const invalidNames = [
      '',
      '   ',
      null,
      undefined,
      true,
      123,
      {},
      [],
      () => {},
      NaN,
    ];

    for (const invalidName of invalidNames) {
      await expect(
        // @ts-expect-error Testing invalid inputs
        createUserUsecase.execute({ name: invalidName })
      ).rejects.toThrow(ValidationError);
    }
  });
});
