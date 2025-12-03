import { NotFoundError } from '@/domain/common/errors';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type DeleteDayUsecaseRequest = {
  date: string;
  userId: string;
};

export class DeleteDayUsecase {
  constructor(private daysRepo: DaysRepo, private usersRepo: UsersRepo) {}

  async execute(request: DeleteDayUsecaseRequest): Promise<void> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `DeleteDayUsecase: User with id ${request.userId} not found`
      );
    }

    const day = await this.daysRepo.getDayByIdAndUserId(
      request.date,
      request.userId
    );
    if (!day) {
      throw new NotFoundError('DeleteDayUsecase: Day not found');
    }

    await this.daysRepo.deleteDayForUser(request.date, request.userId);
  }
}
