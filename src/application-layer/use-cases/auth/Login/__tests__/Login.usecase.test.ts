import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import * as dto from '@/../tests/dtoProperties';
import { UserDTO } from '@/application-layer/dtos/UserDTO';
import { AuthError } from '@/domain/common/errors';
import { User } from '@/domain/entities/user/User';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { DummyPasswordEncryptorService } from '@/infra/services/PasswordEncryptorService/DummyPasswordEncryptorService/DummyPasswordEncryptorService';
import { CreateUserUsecase } from '../../../user/CreateUser/CreateUser.usecase';
import { Uuidv4IdGenerator } from '@/infra/services/IdGenerator/Uuidv4IdGenerator/Uuidv4IdGenerator';
import { LoginUsecase } from '../Login.usecase';

describe('LoginUsecase', () => {
  let usersRepo: MemoryUsersRepo;
  let passwordEncryptor: DummyPasswordEncryptorService;
  let loginUsecase: LoginUsecase;

  const plainPassword = 'secureP@ssword123';
  const userEmail = userTestProps.validUserProps.email;
  let createdUser: UserDTO;

  beforeEach(async () => {
    usersRepo = new MemoryUsersRepo();
    passwordEncryptor = new DummyPasswordEncryptorService();

    // Create a user to log in with
    const createUserUsecase = new CreateUserUsecase(
      usersRepo,
      new Uuidv4IdGenerator(),
      passwordEncryptor,
    );

    createdUser = await createUserUsecase.execute({
      name: userTestProps.validUserProps.name,
      email: userEmail,
      plainPassword,
    });

    loginUsecase = new LoginUsecase(usersRepo, passwordEncryptor);
  });

  describe('Execute', () => {
    it('should return a UserDTO on valid credentials', async () => {
      const result = await loginUsecase.execute({
        email: userEmail,
        plainPassword,
      });

      expect(result).not.toBeInstanceOf(User);
      expect(result.id).toBe(createdUser.id);
      expect(result.email).toBe(createdUser.email);
      expect(result.name).toBe(createdUser.name);
    });

    it('should return all UserDTO properties', async () => {
      const result = await loginUsecase.execute({
        email: userEmail,
        plainPassword,
      });

      for (const prop of dto.userDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });

    it('should not expose hashedPassword', async () => {
      const result = await loginUsecase.execute({
        email: userEmail,
        plainPassword,
      });

      // @ts-expect-error hashedPassword is not part of UserDTO
      expect(result.hashedPassword).toBeUndefined();
    });

    it('should throw AuthError on wrong password', async () => {
      await expect(
        loginUsecase.execute({
          email: userEmail,
          plainPassword: 'wrongPassword!',
        }),
      ).rejects.toThrow(AuthError);
    });

    it('should throw AuthError on non-existent email', async () => {
      await expect(
        loginUsecase.execute({
          email: 'doesnotexist@example.com',
          plainPassword,
        }),
      ).rejects.toThrow(AuthError);
    });

    it('wrong password error message should be identical to non-existent user error message', async () => {
      // Prevents user enumeration attacks
      let wrongPassError: Error | null = null;
      let noUserError: Error | null = null;

      try {
        await loginUsecase.execute({
          email: userEmail,
          plainPassword: 'wrong',
        });
      } catch (e) {
        wrongPassError = e as Error;
      }

      try {
        await loginUsecase.execute({
          email: 'nobody@example.com',
          plainPassword,
        });
      } catch (e) {
        noUserError = e as Error;
      }

      expect(wrongPassError?.message).toBe(noUserError?.message);
    });

    it('should throw ValidationError on invalid email format', async () => {
      await expect(
        loginUsecase.execute({
          email: 'not-an-email',
          plainPassword,
        }),
      ).rejects.toThrow();
    });
  });
});
