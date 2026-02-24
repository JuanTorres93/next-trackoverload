import { UserDTO, toUserDTO } from '@/application-layer/dtos/UserDTO';
import { AuthError } from '@/domain/common/errors';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { PasswordEncryptorService } from '@/domain/services/PasswordEncryptorService.port';
import { Email } from '@/domain/value-objects/Email/Email';

export type LoginUsecaseRequest = {
  email: string;
  plainPassword: string;
};

export class LoginUsecase {
  constructor(
    private usersRepo: UsersRepo,
    private passwordEncryptor: PasswordEncryptorService,
  ) {}

  async execute(request: LoginUsecaseRequest): Promise<UserDTO> {
    // Validate email format
    const email = Email.create(request.email).value;

    const user = await this.usersRepo.getUserByEmail(email);
    // Use the same generic error for both "not found" and
    // "wrong password" cases to avoid user enumeration attacks
    const errorMessage = 'LoginUsecase: Invalid credentials';

    if (!user) {
      throw new AuthError(errorMessage);
    }

    const passwordMatches =
      await this.passwordEncryptor.plainPasswordMatchesHashed(
        request.plainPassword,
        user.hashedPassword,
      );

    if (!passwordMatches) {
      throw new AuthError(errorMessage);
    }

    return toUserDTO(user);
  }
}
