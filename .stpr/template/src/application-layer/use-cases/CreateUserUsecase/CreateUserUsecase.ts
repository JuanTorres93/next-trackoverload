import { AlreadyExistsApplicationError } from '@/application-layer/common/applicationErrors';
import { UserDTO, toUserDTO } from '@/application-layer/dtos/UserDTO';
import { IdGenerator } from '@/application-layer/services/IdGenerator.port';
import { PasswordHasher } from '@/application-layer/services/PasswordHasher';
import { User } from '@/domain/entities/user/User';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { Password } from '@/domain/value-objects/Password/Password';

export type CreateUserUsecaseRequest = {
  email: string;
  plainPassword: string;
};

export class CreateUserUsecase {
  constructor(
    private usersRepo: UsersRepo,
    private idGenerator: IdGenerator,
    private passwordHasher: PasswordHasher,
  ) {}

  async execute(request: CreateUserUsecaseRequest): Promise<UserDTO> {
    const user = await this.usersRepo.getByEmail(request.email);

    if (user) {
      throw new AlreadyExistsApplicationError('User with that email already exists');
    }

    const validatedPassword = Password.create(request.plainPassword);

    const hashedPassword = await this.passwordHasher.hashPassword(validatedPassword.value);

    const newUser = User.create({
      email: request.email,
      hashedPassword,
      id: this.idGenerator.generateId(),
    });

    await this.usersRepo.save(newUser);

    return toUserDTO(newUser);
  }
}
