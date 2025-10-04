import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { Meal } from '@/domain/entities/meal/Meal';
import { validateNonEmptyString } from '@/domain/common/validation';

export type GetMealByIdUsecaseRequest = {
  id: string;
};

export class GetMealByIdUsecase {
  constructor(private mealsRepo: MealsRepo) {}

  async execute(request: GetMealByIdUsecaseRequest): Promise<Meal | null> {
    validateNonEmptyString(request.id, 'GetMealByIdUsecase');

    const meal = await this.mealsRepo.getMealById(request.id);
    return meal || null;
  }
}
