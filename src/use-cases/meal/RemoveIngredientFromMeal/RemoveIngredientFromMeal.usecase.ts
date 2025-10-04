import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { Meal } from '@/domain/entities/meal/Meal';
import { validateNonEmptyString } from '@/domain/common/validation';
import { NotFoundError } from '@/domain/common/errors';

export type RemoveIngredientFromMealUsecaseRequest = {
  mealId: string;
  ingredientId: string;
};

export class RemoveIngredientFromMealUsecase {
  constructor(private mealsRepo: MealsRepo) {}

  async execute(
    request: RemoveIngredientFromMealUsecaseRequest
  ): Promise<Meal> {
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

    // NOTE: validation done in the entity method
    existingMeal.removeIngredientLineByIngredientId(request.ingredientId);

    await this.mealsRepo.saveMeal(existingMeal);

    return existingMeal;
  }
}
