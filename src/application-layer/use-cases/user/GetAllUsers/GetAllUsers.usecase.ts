import { User } from '@/domain/entities/user/User';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export class GetAllUsersUsecase {
  constructor(private usersRepo: UsersRepo) {}

  async execute(): Promise<User[]> {
    const users = await this.usersRepo.getAllUsers();

    return users || [];
  }
}
