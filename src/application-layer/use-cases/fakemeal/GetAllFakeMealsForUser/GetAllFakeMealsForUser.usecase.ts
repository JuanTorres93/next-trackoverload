import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';
import {
  FakeMealDTO,
  toFakeMealDTO,
} from '@/application-layer/dtos/FakeMealDTO';
import { validateNonEmptyString } from '@/domain/common/validation';

export type GetAllFakeMealsForUserUsecaseRequest = {
  userId: string;
};

export class GetAllFakeMealsForUserUsecase {
  constructor(private fakeMealsRepo: FakeMealsRepo) {}

  async execute(
    request: GetAllFakeMealsForUserUsecaseRequest
  ): Promise<FakeMealDTO[]> {
    validateNonEmptyString(request.userId, 'GetAllFakeMealsUsecase: userId');

    const fakeMeals = await this.fakeMealsRepo.getAllFakeMealsByUserId(
      request.userId
    );

    return fakeMeals.map(toFakeMealDTO) || [];
  }
}
