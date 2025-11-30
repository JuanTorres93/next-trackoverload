import { NotFoundError } from '@/domain/common/errors';
import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';

export type DeleteFakeMealUsecaseRequest = {
  id: string;
  userId: string;
};

export class DeleteFakeMealUsecase {
  constructor(private fakeMealsRepo: FakeMealsRepo) {}

  async execute(request: DeleteFakeMealUsecaseRequest): Promise<void> {
    const fakeMeal = await this.fakeMealsRepo.getFakeMealByIdAndUserId(
      request.id,
      request.userId
    );
    if (!fakeMeal) {
      throw new NotFoundError(
        `DeleteFakeMealUsecase: FakeMeal with id ${request.id} and userId ${request.userId} not found`
      );
    }

    await this.fakeMealsRepo.deleteFakeMealByIdAndUserId(
      request.id,
      request.userId
    );
  }
}
