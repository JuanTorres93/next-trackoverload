import { NotFoundError } from '@/domain/common/errors';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type DeleteUserUsecaseRequest = {
  id: string;
};

export class DeleteUserUsecase {
  constructor(private usersRepo: UsersRepo) {}

  async execute(request: DeleteUserUsecaseRequest): Promise<void> {
    const user = await this.usersRepo.getUserById(request.id);

    if (!user) {
      throw new NotFoundError('DeleteUserUsecase: User not found');
    }

    await this.usersRepo.deleteUser(request.id);
  }
}
