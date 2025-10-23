import { UserDTO, toUserDTO } from '@/application-layer/dtos/UserDTO';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export class GetAllUsersUsecase {
  constructor(private usersRepo: UsersRepo) {}

  async execute(): Promise<UserDTO[]> {
    const users = await this.usersRepo.getAllUsers();

    return users.map(toUserDTO) || [];
  }
}
