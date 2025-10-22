import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { User } from '@/domain/entities/user/User';
import { validateNonEmptyString } from '@/domain/common/validation';

export type GetUserByIdUsecaseRequest = {
  id: string;
};

export class GetUserByIdUsecase {
  constructor(private usersRepo: UsersRepo) {}

  async execute(request: GetUserByIdUsecaseRequest): Promise<User | null> {
    validateNonEmptyString(request.id, 'GetUserByIdUsecase id');

    const user = await this.usersRepo.getUserById(request.id);
    return user || null;
  }
}
