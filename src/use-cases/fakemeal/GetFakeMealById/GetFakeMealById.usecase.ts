import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { validateNonEmptyString } from '@/domain/common/validation';

export type GetFakeMealByIdUsecaseRequest = {
  id: string;
};

export class GetFakeMealByIdUsecase {
  constructor(private fakeMealsRepo: FakeMealsRepo) {}

  async execute(
    request: GetFakeMealByIdUsecaseRequest
  ): Promise<FakeMeal | null> {
    validateNonEmptyString(request.id, 'GetFakeMealByIdUsecase');

    const fakeMeal = await this.fakeMealsRepo.getFakeMealById(request.id);
    return fakeMeal || null;
  }
}
