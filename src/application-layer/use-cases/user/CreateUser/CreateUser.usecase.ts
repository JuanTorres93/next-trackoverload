import { UserDTO, toUserDTO } from '@/application-layer/dtos/UserDTO';
import { User } from '@/domain/entities/user/User';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { v4 as uuidv4 } from 'uuid';

export type CreateUserUsecaseRequest = {
  name: string;
  email: string;
  customerId?: string;
};

export class CreateUserUsecase {
  constructor(private usersRepo: UsersRepo) {}

  async execute(request: CreateUserUsecaseRequest): Promise<UserDTO> {
    // TODO IMPORTANT. When implementing user fully, check for existing user and prevent duplicates.
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
