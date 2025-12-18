import { MealDTO, toMealDTO } from '@/application-layer/dtos/MealDTO';
import { NotFoundError } from '@/domain/common/errors';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type RemoveIngredientFromMealUsecaseRequest = {
  userId: string;
  mealId: string;
  ingredientId: string;
};

export class RemoveIngredientFromMealUsecase {
  constructor(private mealsRepo: MealsRepo, private usersRepo: UsersRepo) {}

  async execute(
    request: RemoveIngredientFromMealUsecaseRequest
  ): Promise<MealDTO> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `RemoveIngredientFromMealUsecase: user with id ${request.userId} not found`
      );
    }

    const existingMeal = await this.mealsRepo.getMealByIdForUser(
      request.mealId,
      request.userId
    );
    if (!existingMeal) {
      throw new NotFoundError(
        `RemoveIngredientFromMealUsecase: Meal with id ${request.mealId} not found`
      );
    }

    existingMeal.removeIngredientLineByIngredientId(request.ingredientId);

    await this.mealsRepo.saveMeal(existingMeal);

    return toMealDTO(existingMeal);
  }
}
