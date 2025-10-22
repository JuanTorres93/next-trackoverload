import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';
import { FakeUpdateProps } from '@/domain/entities/fakemeal/FakeMeal';
import {
  FakeMealDTO,
  toFakeMealDTO,
} from '@/application-layer/dtos/FakeMealDTO';
import { validateNonEmptyString } from '@/domain/common/validation';
import { NotFoundError } from '@/domain/common/errors';

export type UpdateFakeMealUsecaseRequest = {
  id: string;
  userId: string;
  patch: FakeUpdateProps;
};

export class UpdateFakeMealUsecase {
  constructor(private fakeMealsRepo: FakeMealsRepo) {}

  async execute(request: UpdateFakeMealUsecaseRequest): Promise<FakeMealDTO> {
    validateNonEmptyString(request.id, 'UpdateFakeMealUsecase: id');
    validateNonEmptyString(request.userId, 'UpdateFakeMealUsecase: userId');

    const fakeMeal = await this.fakeMealsRepo.getFakeMealByIdAndUserId(
      request.id,
      request.userId
    );
    if (!fakeMeal) {
      throw new NotFoundError(
        `UpdateFakeMealUsecase: FakeMeal with id ${request.id} and userId ${request.userId} not found`
      );
    }

    // NOTE: The update method on the entity handles validation of the patch
    fakeMeal.update(request.patch);
    await this.fakeMealsRepo.saveFakeMeal(fakeMeal);

    return toFakeMealDTO(fakeMeal);
  }
}
