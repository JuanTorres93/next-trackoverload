import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { validateNonEmptyString } from '@/domain/common/validation';

export type GetAllFakeMealsForUserUsecaseRequest = {
  userId: string;
};

export class GetAllFakeMealsForUserUsecase {
  constructor(private fakeMealsRepo: FakeMealsRepo) {}

  async execute(
    request: GetAllFakeMealsForUserUsecaseRequest
  ): Promise<FakeMeal[]> {
    validateNonEmptyString(request.userId, 'GetAllFakeMealsUsecase: userId');

    const fakeMeals = await this.fakeMealsRepo.getAllFakeMealsByUserId(
      request.userId
    );

    return fakeMeals || [];
  }
}
