import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { validateNonEmptyString } from '@/domain/common/validation';

export type GetFakeMealByIdForUserUsecaseRequest = {
  id: string;
  userId: string;
};

export class GetFakeMealByIdForUserUsecase {
  constructor(private fakeMealsRepo: FakeMealsRepo) {}

  async execute(
    request: GetFakeMealByIdForUserUsecaseRequest
  ): Promise<FakeMeal | null> {
    validateNonEmptyString(request.id, 'GetFakeMealByIdUsecase: id');
    validateNonEmptyString(request.userId, 'GetFakeMealByIdUsecase: userId');

    const fakeMeal = await this.fakeMealsRepo.getFakeMealByIdAndUserId(
      request.id,
      request.userId
    );
    return fakeMeal || null;
  }
}
