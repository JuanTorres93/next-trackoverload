import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { validateNonEmptyString } from '@/domain/common/validation';
import { AuthError, NotFoundError } from '@/domain/common/errors';

export type DeleteMealUsecaseRequest = {
  id: string;
  userId: string;
};

export class DeleteMealUsecase {
  constructor(private mealsRepo: MealsRepo) {}

  async execute(request: DeleteMealUsecaseRequest): Promise<void> {
    validateNonEmptyString(request.id, 'DeleteMealUsecase id');
    validateNonEmptyString(request.userId, 'DeleteMealUsecase userId');

    // Search meal
    const meal = await this.mealsRepo.getMealById(request.id);

    if (!meal) {
      throw new NotFoundError('DeleteMealUsecase: Meal not found');
    }

    if (meal.userId !== request.userId) {
      throw new AuthError('DeleteMealUsecase: Meal not found for this user');
    }

    await this.mealsRepo.deleteMeal(request.id);
  }
}
