import {
  FakeMealDTO,
  toFakeMealDTO,
} from '@/application-layer/dtos/FakeMealDTO';
import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';

export type GetFakeMealByIdForUserUsecaseRequest = {
  id: string;
  userId: string;
};

export class GetFakeMealByIdForUserUsecase {
  constructor(private fakeMealsRepo: FakeMealsRepo) {}

  async execute(
    request: GetFakeMealByIdForUserUsecaseRequest
  ): Promise<FakeMealDTO | null> {
    const fakeMeal = await this.fakeMealsRepo.getFakeMealByIdAndUserId(
      request.id,
      request.userId
    );

    return fakeMeal ? toFakeMealDTO(fakeMeal) : null;
  }
}
