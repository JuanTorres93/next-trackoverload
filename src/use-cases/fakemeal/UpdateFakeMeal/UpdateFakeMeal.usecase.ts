import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';
import { FakeMeal, FakeUpdateProps } from '@/domain/entities/fakemeal/FakeMeal';
import { validateNonEmptyString } from '@/domain/common/validation';
import { NotFoundError } from '@/domain/common/errors';

export type UpdateFakeMealUsecaseRequest = {
  id: string;
  patch: FakeUpdateProps;
};

export class UpdateFakeMealUsecase {
  constructor(private fakeMealsRepo: FakeMealsRepo) {}

  async execute(request: UpdateFakeMealUsecaseRequest): Promise<FakeMeal> {
    validateNonEmptyString(request.id, 'UpdateFakeMealUsecase id');

    const fakeMeal = await this.fakeMealsRepo.getFakeMealById(request.id);
    if (!fakeMeal) {
      throw new NotFoundError(
        `UpdateFakeMealUsecase: FakeMeal with id ${request.id} not found`
      );
    }

    // NOTE: The update method on the entity handles validation of the patch
    fakeMeal.update(request.patch);
    await this.fakeMealsRepo.saveFakeMeal(fakeMeal);

    return fakeMeal;
  }
}
