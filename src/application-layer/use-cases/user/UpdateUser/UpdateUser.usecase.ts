import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { User, UserUpdateProps } from '@/domain/entities/user/User';
import { UserDTO, toUserDTO } from '@/application-layer/dtos/UserDTO';
import { Id } from '@/domain/value-objects/Id/Id';
import { NotFoundError } from '@/domain/common/errors';
import {
  validateNonEmptyString,
  validateObject,
} from '@/domain/common/validation';

export type UpdateUserUsecaseRequest = {
  id: string;
  patch?: UserUpdateProps;
};

export class UpdateUserUsecase {
  constructor(private usersRepo: UsersRepo) {}

  async execute(request: UpdateUserUsecaseRequest): Promise<UserDTO> {
    validateNonEmptyString(request.id, 'UpdateUserUsecase id');
    if (request.patch !== undefined)
      validateObject(request.patch, 'UpdateUserUsecase patch');

    const existingUser = await this.usersRepo.getUserById(request.id);

    if (!existingUser) {
      throw new NotFoundError('UpdateUserUsecase: User not found');
    }

    const patch: UserUpdateProps = request.patch || {};

    if (Object.keys(patch).length > 0) {
      // Create a new user with the same properties
      const updatedUser = User.create({
        id: Id.create(existingUser.id),
        name: existingUser.name,
        customerId: existingUser.customerId
          ? Id.create(existingUser.customerId)
          : undefined,
        createdAt: existingUser.createdAt,
        updatedAt: existingUser.updatedAt,
      });

      // Apply the updates using the entity's update method
      updatedUser.update(patch);

      await this.usersRepo.saveUser(updatedUser);

      return toUserDTO(updatedUser);
    }

    return toUserDTO(existingUser); // No changes made, return the original
  }
}
