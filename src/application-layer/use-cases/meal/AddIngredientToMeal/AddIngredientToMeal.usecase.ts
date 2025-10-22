import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { Meal } from '@/domain/entities/meal/Meal';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { validateNonEmptyString } from '@/domain/common/validation';
import {
  NotFoundError,
  ValidationError,
  AuthError,
} from '@/domain/common/errors';

export type AddIngredientToMealUsecaseRequest = {
  userId: string;
  mealId: string;
  ingredientLine: IngredientLine;
};

export class AddIngredientToMealUsecase {
  constructor(private mealsRepo: MealsRepo) {}

  async execute(request: AddIngredientToMealUsecaseRequest): Promise<Meal> {
    validateNonEmptyString(request.mealId, 'AddIngredientToMealUsecase mealId');
    validateNonEmptyString(request.userId, 'AddIngredientToMealUsecase userId');

    if (!(request.ingredientLine instanceof IngredientLine)) {
      throw new ValidationError(
        'AddIngredientToMealUsecase: ingredientLine must be an IngredientLine instance'
      );
    }

    const existingMeal = await this.mealsRepo.getMealById(request.mealId);
    if (!existingMeal) {
      throw new NotFoundError(
        `AddIngredientToMealUsecase: Meal with id ${request.mealId} not found`
      );
    }

    if (existingMeal.userId !== request.userId) {
      throw new AuthError(
        'AddIngredientToMealUsecase: User not authorized to modify this meal'
      );
    }

    existingMeal.addIngredientLine(request.ingredientLine);
    await this.mealsRepo.saveMeal(existingMeal);

    return existingMeal;
  }
}
