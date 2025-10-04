import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';
import { validateNonEmptyString } from '@/domain/common/validation';
import { NotFoundError } from '@/domain/common/errors';

export type DeleteFakeMealUsecaseRequest = {
  id: string;
};

export class DeleteFakeMealUsecase {
  constructor(private fakeMealsRepo: FakeMealsRepo) {}

  async execute(request: DeleteFakeMealUsecaseRequest): Promise<void> {
    validateNonEmptyString(request.id, 'DeleteFakeMealUsecase id');

    const fakeMeal = await this.fakeMealsRepo.getFakeMealById(request.id);
    if (!fakeMeal) {
      throw new NotFoundError(
        `DeleteFakeMealUsecase: FakeMeal with id ${request.id} not found`
      );
    }

    await this.fakeMealsRepo.deleteFakeMeal(request.id);
  }
}
