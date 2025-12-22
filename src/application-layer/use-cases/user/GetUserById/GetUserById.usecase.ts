import { UserDTO, toUserDTO } from '@/application-layer/dtos/UserDTO';
import { PermissionError } from '@/domain/common/errors';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type GetUserByIdUsecaseRequest = {
  actorUserId: string;
  targetUserId: string;
};

export class GetUserByIdUsecase {
  constructor(private usersRepo: UsersRepo) {}

  async execute(request: GetUserByIdUsecaseRequest): Promise<UserDTO | null> {
    if (request.actorUserId !== request.targetUserId) {
      throw new PermissionError('GetUserByIdUsecase: Access denied.');
    }

    const user = await this.usersRepo.getUserById(request.targetUserId);
    return user ? toUserDTO(user) : null;
  }
}
