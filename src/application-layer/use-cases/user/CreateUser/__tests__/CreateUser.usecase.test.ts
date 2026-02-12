import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import * as dto from '@/../tests/dtoProperties';
import { toUserDTO, UserDTO } from '@/application-layer/dtos/UserDTO';
import { AlreadyExistsError } from '@/domain/common/errors';
import { User } from '@/domain/entities/user/User';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { DummyPasswordEncryptorService } from '@/infra/services/PasswordEncryptorService/DummyPasswordEncryptorService/DummyPasswordEncryptorService';
import { Uuidv4IdGenerator } from '@/infra/services/IdGenerator/Uuidv4IdGenerator/Uuidv4IdGenerator';
import { CreateUserUsecase } from '../CreateUser.usecase';

describe('CreateUserUsecase', () => {
  let usersRepo: MemoryUsersRepo;
  let passwordEncryptor: DummyPasswordEncryptorService;

  let createUserUsecase: CreateUserUsecase;
  let user: UserDTO;

  const plainPassword = 'secureP@ssword123';

  beforeEach(async () => {
    usersRepo = new MemoryUsersRepo();
    passwordEncryptor = new DummyPasswordEncryptorService();

    createUserUsecase = new CreateUserUsecase(
      usersRepo,
      new Uuidv4IdGenerator(),
      passwordEncryptor,
    );

    user = await createUserUsecase.execute({
      name: userTestProps.validUserProps.name,
      email: userTestProps.validUserProps.email,
      plainPassword: plainPassword,
    });
  });

  describe('Execute', () => {
    it('should create user', async () => {
      expect(user.name).toBe(userTestProps.validUserProps.name);
      expect(user.email).toBe(userTestProps.validUserProps.email);
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

    it('should not expose password', () => {
      // @ts-expect-error hashedPassword is not part of UserDTO
      expect(user.hashedPassword).toBeUndefined();
    });

    it('user entity should have hashedPassword', async () => {
      const userEntity = await usersRepo.getUserById(user.id);

      const expectedHashedPassword =
        await passwordEncryptor.hashPassword(plainPassword);

      expect(userEntity!.hashedPassword).toBe(expectedHashedPassword);
    });

    it('should create user with customerId', async () => {
      const result = await createUserUsecase.execute({
        name: 'Jane Doe',
        email: 'janedoe@example.com',
        customerId: 'customer-123',
        plainPassword,
      });

      expect(result.customerId).toBe('customer-123');
    });

    it('should generate unique IDs for different users', async () => {
      const user2 = await createUserUsecase.execute({
        name: 'User Two',
        email: 'usertwo@example.com',
        plainPassword,
      });

      expect(user.id).not.toBe(user2.id);
    });
  });

  describe('Errors', () => {
    it('should throw error if email already exists', async () => {
      const request = {
        name: 'Duplicate Email User',
        email: userTestProps.validUserProps.email,
        plainPassword,
      };

      await expect(createUserUsecase.execute(request)).rejects.toThrow(
        AlreadyExistsError,
      );

      await expect(createUserUsecase.execute(request)).rejects.toThrow(
        /CreateUserUsecase.*User.*email.*already exists/,
      );
    });

    it('should throw error for same email with different case', async () => {
      const request = {
        name: 'Duplicate Email User',
        email: userTestProps.validUserProps.email.toUpperCase(),
        plainPassword,
      };

      await expect(createUserUsecase.execute(request)).rejects.toThrow(
        AlreadyExistsError,
      );

      await expect(createUserUsecase.execute(request)).rejects.toThrow(
        /CreateUserUsecase.*User.*email.*already exists/,
      );
    });

    it('should throw error if customer id already exists', async () => {
      // Create first user with customerId
      await createUserUsecase.execute({
        name: 'First User',
        email: 'firstuser@example.com',
        customerId: 'customer-123',
        plainPassword,
      });

      // Attempt to create second user with same customerId
      const request = {
        name: 'Second User',
        email: 'seconduser@example.com',
        customerId: 'customer-123',
        plainPassword,
      };

      await expect(createUserUsecase.execute(request)).rejects.toThrow(
        AlreadyExistsError,
      );

      await expect(createUserUsecase.execute(request)).rejects.toThrow(
        /CreateUserUsecase.*User.*customerId.*already exists/,
      );
    });
  });
});
