import { AuthError, NotFoundError } from '@/domain/common/errors';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type DeleteMealUsecaseRequest = {
  id: string;
  userId: string;
};

export class DeleteMealUsecase {
  constructor(private mealsRepo: MealsRepo, private usersRepo: UsersRepo) {}

  async execute(request: DeleteMealUsecaseRequest): Promise<void> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `DeleteMealUsecase: user with id ${request.userId} not found`
      );
    }

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
