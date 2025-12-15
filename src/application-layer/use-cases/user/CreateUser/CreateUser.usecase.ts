import { UserDTO, toUserDTO } from '@/application-layer/dtos/UserDTO';
import { AlreadyExistsError } from '@/domain/common/errors';
import { User } from '@/domain/entities/user/User';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { Email } from '@/domain/value-objects/Email/Email';
import { v4 as uuidv4 } from 'uuid';

export type CreateUserUsecaseRequest = {
  name: string;
  email: string;
  customerId?: string;
};

export class CreateUserUsecase {
  constructor(private usersRepo: UsersRepo) {}

  async execute(request: CreateUserUsecaseRequest): Promise<UserDTO> {
    // Validate email
    const email = Email.create(request.email).value;

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
        'CreateUserUsecase: User with this email already exists'
      );
    }

    if (existingCustomer) {
      throw new AlreadyExistsError(
        'CreateUserUsecase: User with this customerId already exists'
      );
    }

    // Create new user
    const newUser = User.create({
      id: uuidv4(),
      name: request.name,
      email: request.email,
      customerId: request.customerId ? request.customerId : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.usersRepo.saveUser(newUser);

    return toUserDTO(newUser);
  }
}
