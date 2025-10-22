import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { MealDTO, toMealDTO } from '@/application-layer/dtos/MealDTO';
import { validateNonEmptyString } from '@/domain/common/validation';
import { AuthError, NotFoundError } from '@/domain/common/errors';

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
    validateNonEmptyString(
      request.userId,
      'RemoveIngredientFromMealUsecase userId'
    );
    validateNonEmptyString(
      request.mealId,
      'RemoveIngredientFromMealUsecase mealId'
    );
    validateNonEmptyString(
      request.ingredientId,
      'RemoveIngredientFromMealUsecase ingredientId'
    );

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

    // NOTE: validation done in the entity method
    existingMeal.removeIngredientLineByIngredientId(request.ingredientId);

    await this.mealsRepo.saveMeal(existingMeal);

    return toMealDTO(existingMeal);
  }
}
