import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { User } from '@/domain/entities/user/User';
import { v4 as uuidv4 } from 'uuid';

export type CreateUserUsecaseRequest = {
  name: string;
  customerId?: string;
};

export class CreateUserUsecase {
  constructor(private usersRepo: UsersRepo) {}

  async execute(request: CreateUserUsecaseRequest): Promise<User> {
    // NOTE: name and customerId are validated in User.create()
    const newUser = User.create({
      id: uuidv4(),
      name: request.name,
      customerId: request.customerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.usersRepo.saveUser(newUser);

    return newUser;
  }
}
