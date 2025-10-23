import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { UserDTO, toUserDTO } from '@/application-layer/dtos/UserDTO';
import { validateNonEmptyString } from '@/domain/common/validation';

export type GetUserByIdUsecaseRequest = {
  id: string;
};

export class GetUserByIdUsecase {
  constructor(private usersRepo: UsersRepo) {}

  async execute(request: GetUserByIdUsecaseRequest): Promise<UserDTO | null> {
    validateNonEmptyString(request.id, 'GetUserByIdUsecase id');

    const user = await this.usersRepo.getUserById(request.id);
    return user ? toUserDTO(user) : null;
  }
}
