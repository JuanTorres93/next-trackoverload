import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { Meal } from '@/domain/entities/meal/Meal';
import { validateNonEmptyString } from '@/domain/common/validation';
import { AuthError } from '@/domain/common/errors';

export type GetMealByIdUsecaseRequest = {
  id: string;
  userId: string;
};

export class GetMealByIdForUserUsecase {
  constructor(private mealsRepo: MealsRepo) {}

  async execute(request: GetMealByIdUsecaseRequest): Promise<Meal | null> {
    validateNonEmptyString(request.id, 'GetMealByIdForUserUsecase id');
    validateNonEmptyString(request.userId, 'GetMealByIdForUserUsecase userId');

    const meal = await this.mealsRepo.getMealById(request.id);

    if (meal && meal.userId !== request.userId) {
      throw new AuthError('You are not allowed to access this meal');
    }

    return meal || null;
  }
}
