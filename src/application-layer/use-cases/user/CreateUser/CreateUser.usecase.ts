import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { User } from '@/domain/entities/user/User';
import { UserDTO, toUserDTO } from '@/application-layer/dtos/UserDTO';
import { Id } from '@/domain/value-objects/Id/Id';
import { v4 as uuidv4 } from 'uuid';

export type CreateUserUsecaseRequest = {
  name: string;
  customerId?: string;
};

export class CreateUserUsecase {
  constructor(private usersRepo: UsersRepo) {}

  async execute(request: CreateUserUsecaseRequest): Promise<UserDTO> {
    // NOTE: name and customerId are validated in User.create()
    const newUser = User.create({
      id: Id.create(uuidv4()),
      name: request.name,
      customerId: request.customerId
        ? Id.create(request.customerId)
        : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.usersRepo.saveUser(newUser);

    return toUserDTO(newUser);
  }
}
