import { UserDTO, toUserDTO } from '@/application-layer/dtos/UserDTO';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type GetUserByIdUsecaseRequest = {
  id: string;
};

export class GetUserByIdUsecase {
  constructor(private usersRepo: UsersRepo) {}

  async execute(request: GetUserByIdUsecaseRequest): Promise<UserDTO | null> {
    const user = await this.usersRepo.getUserById(request.id);
    return user ? toUserDTO(user) : null;
  }
}
