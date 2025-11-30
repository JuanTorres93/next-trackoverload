import { AuthError, NotFoundError } from '@/domain/common/errors';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';

export type DeleteMealUsecaseRequest = {
  id: string;
  userId: string;
};

export class DeleteMealUsecase {
  constructor(private mealsRepo: MealsRepo) {}

  async execute(request: DeleteMealUsecaseRequest): Promise<void> {
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
