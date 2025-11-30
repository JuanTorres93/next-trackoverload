import {
  FakeMealDTO,
  toFakeMealDTO,
} from '@/application-layer/dtos/FakeMealDTO';
import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';

export type GetAllFakeMealsForUserUsecaseRequest = {
  userId: string;
};

export class GetAllFakeMealsForUserUsecase {
  constructor(private fakeMealsRepo: FakeMealsRepo) {}

  async execute(
    request: GetAllFakeMealsForUserUsecaseRequest
  ): Promise<FakeMealDTO[]> {
    const fakeMeals = await this.fakeMealsRepo.getAllFakeMealsByUserId(
      request.userId
    );

    return fakeMeals.map(toFakeMealDTO) || [];
  }
}
