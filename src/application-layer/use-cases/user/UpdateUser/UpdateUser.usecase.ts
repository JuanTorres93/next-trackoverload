import { UserDTO, toUserDTO } from '@/application-layer/dtos/UserDTO';
import { NotFoundError, PermissionError } from '@/domain/common/errors';
import { UserUpdateProps } from '@/domain/entities/user/User';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type UpdateUserUsecaseRequest = {
  actorUserId: string;
  targetUserId: string;
  patch?: UserUpdateProps;
};

export class UpdateUserUsecase {
  constructor(private usersRepo: UsersRepo) {}

  async execute(request: UpdateUserUsecaseRequest): Promise<UserDTO> {
    if (request.actorUserId !== request.targetUserId) {
      throw new PermissionError(
        'UpdateUserUsecase: Access denied to update this user'
      );
    }

    const existingUser = await this.usersRepo.getUserById(request.targetUserId);

    if (!existingUser) {
      throw new NotFoundError('UpdateUserUsecase: User not found');
    }

    const patch: UserUpdateProps = request.patch || {};
    existingUser.update(patch);

    await this.usersRepo.saveUser(existingUser);

    return toUserDTO(existingUser);
  }
}
