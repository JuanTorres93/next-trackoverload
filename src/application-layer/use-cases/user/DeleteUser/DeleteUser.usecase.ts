import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { validateNonEmptyString } from '@/domain/common/validation';
import { NotFoundError } from '@/domain/common/errors';

export type DeleteUserUsecaseRequest = {
  id: string;
};

export class DeleteUserUsecase {
  constructor(private usersRepo: UsersRepo) {}

  async execute(request: DeleteUserUsecaseRequest): Promise<void> {
    validateNonEmptyString(request.id, 'DeleteUserUsecase id');

    // Search user
    const user = await this.usersRepo.getUserById(request.id);

    if (!user) {
      throw new NotFoundError('DeleteUserUsecase: User not found');
    }

    await this.usersRepo.deleteUser(request.id);
  }
}
