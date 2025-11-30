import { UserDTO, toUserDTO } from '@/application-layer/dtos/UserDTO';
import { NotFoundError } from '@/domain/common/errors';
import { UserUpdateProps } from '@/domain/entities/user/User';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type UpdateUserUsecaseRequest = {
  id: string;
  patch?: UserUpdateProps;
};

export class UpdateUserUsecase {
  constructor(private usersRepo: UsersRepo) {}

  async execute(request: UpdateUserUsecaseRequest): Promise<UserDTO> {
    const existingUser = await this.usersRepo.getUserById(request.id);

    if (!existingUser) {
      throw new NotFoundError('UpdateUserUsecase: User not found');
    }

    const patch: UserUpdateProps = request.patch || {};
    existingUser.update(patch);

    await this.usersRepo.saveUser(existingUser);

    return toUserDTO(existingUser);
  }
}
