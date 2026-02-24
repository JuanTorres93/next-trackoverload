import { UserDTO, toUserDTO } from '@/application-layer/dtos/UserDTO';
import { AlreadyExistsError } from '@/domain/common/errors';
import { User } from '@/domain/entities/user/User';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { Email } from '@/domain/value-objects/Email/Email';
import { IdGenerator } from '@/domain/services/IdGenerator.port';
import { PasswordEncryptorService } from '@/domain/services/PasswordEncryptorService.port';
import { Password } from '@/domain/value-objects/Password/Password';

export type CreateUserUsecaseRequest = {
  name: string;
  email: string;
  plainPassword: string;
  customerId?: string;
};

export class CreateUserUsecase {
  constructor(
    private usersRepo: UsersRepo,
    private idGenerator: IdGenerator,
    private passwordEncryptor: PasswordEncryptorService,
  ) {}

  async execute(request: CreateUserUsecaseRequest): Promise<UserDTO> {
    // Validate email
    const email = Email.create(request.email).value;
    const validatedPassword = Password.create(request.plainPassword).value;

    // Check for existing user with same email or customerId
    const existingEmailPromise = this.usersRepo.getUserByEmail(email);

    const existingCustomerIdPromise = request.customerId
      ? this.usersRepo.getUserByCustomerId(request.customerId)
      : Promise.resolve(null);

    const [existingEmail, existingCustomer] = await Promise.all([
      existingEmailPromise,
      existingCustomerIdPromise,
    ]);

    if (existingEmail) {
      throw new AlreadyExistsError(
        'CreateUserUsecase: User with this email already exists',
      );
    }

    if (existingCustomer) {
      throw new AlreadyExistsError(
        'CreateUserUsecase: User with this customerId already exists',
      );
    }

    const hashedPassword =
      await this.passwordEncryptor.hashPassword(validatedPassword);

    const newUser = User.create({
      id: this.idGenerator.generateId(),
      name: request.name,
      email: request.email,
      hashedPassword,
      customerId: request.customerId ? request.customerId : undefined,
    });

    await this.usersRepo.saveUser(newUser);

    return toUserDTO(newUser);
  }
}
