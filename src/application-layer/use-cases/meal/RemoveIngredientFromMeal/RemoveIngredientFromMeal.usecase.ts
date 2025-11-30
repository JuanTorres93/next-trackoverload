import { MealDTO, toMealDTO } from '@/application-layer/dtos/MealDTO';
import { AuthError, NotFoundError } from '@/domain/common/errors';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';

export type RemoveIngredientFromMealUsecaseRequest = {
  userId: string;
  mealId: string;
  ingredientId: string;
};

export class RemoveIngredientFromMealUsecase {
  constructor(private mealsRepo: MealsRepo) {}

  async execute(
    request: RemoveIngredientFromMealUsecaseRequest
  ): Promise<MealDTO> {
    const existingMeal = await this.mealsRepo.getMealById(request.mealId);
    if (!existingMeal) {
      throw new NotFoundError(
        `RemoveIngredientFromMealUsecase: Meal with id ${request.mealId} not found`
      );
    }

    if (existingMeal.userId !== request.userId) {
      throw new AuthError(
        `RemoveIngredientFromMealUsecase: Meal with id ${request.mealId} not found for user ${request.userId}`
      );
    }

    existingMeal.removeIngredientLineByIngredientId(request.ingredientId);

    await this.mealsRepo.saveMeal(existingMeal);

    return toMealDTO(existingMeal);
  }
}
