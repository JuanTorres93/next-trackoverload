import { NotFoundError, ValidationError } from '@/domain/common/errors';
import {
  validateGreaterThanZero,
  validateNonEmptyString,
} from '@/domain/common/validation';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { Meal } from '@/domain/entities/meal/Meal';
import { IngredientsRepo } from '@/domain/repos/IngredientsRepo.port';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';

export type UpdateIngredientInMealUsecaseRequest = {
  userId: string;
  mealId: string;
  ingredientLineId: string;
  ingredientId?: string;
  quantityInGrams?: number;
};

export class UpdateIngredientInMealUsecase {
  constructor(
    private mealsRepo: MealsRepo,
    private ingredientsRepo: IngredientsRepo
  ) {}

  async execute(request: UpdateIngredientInMealUsecaseRequest): Promise<Meal> {
    validateNonEmptyString(
      request.userId,
      'UpdateIngredientInMealUsecase userId'
    );
    validateNonEmptyString(
      request.mealId,
      'UpdateIngredientInMealUsecase mealId'
    );
    validateNonEmptyString(
      request.ingredientLineId,
      'UpdateIngredientInMealUsecase ingredientLineId'
    );

    // Ensure at least one field to update is provided
    if (
      request.ingredientId === undefined &&
      request.quantityInGrams === undefined
    ) {
      throw new ValidationError(
        'UpdateIngredientInMealUsecase: At least one of ingredientId or quantityInGrams must be provided'
      );
    }

    // Validate quantityInGrams if provided
    if (request.quantityInGrams !== undefined)
      validateGreaterThanZero(
        request.quantityInGrams,
        'UpdateIngredientInMealUsecase quantityInGrams'
      );

    // Get the new ingredient if ingredientId is provided
    let newIngredient: Ingredient | undefined;
    if (request.ingredientId !== undefined) {
      validateNonEmptyString(
        request.ingredientId,
        'UpdateIngredientInMealUsecase ingredientId'
      );

      const foundIngredient = await this.ingredientsRepo.getIngredientById(
        request.ingredientId
      );

      if (!foundIngredient) {
        throw new NotFoundError(
          `Ingredient with id ${request.ingredientId} not found`
        );
      }

      newIngredient = foundIngredient;
    }

    // Get the existing meal
    const existingMeal = await this.mealsRepo.getMealByIdForUser(
      request.mealId,
      request.userId
    );

    if (!existingMeal) {
      throw new NotFoundError(
        `UpdateIngredientInMealUsecase: Meal with id ${request.mealId} not found`
      );
    }

    // Find the ingredient line in the meal
    const existingIngredientLine = existingMeal.ingredientLines.find(
      (line) => line.id === request.ingredientLineId
    );

    if (!existingIngredientLine) {
      throw new NotFoundError(
        `UpdateIngredientInMealUsecase: IngredientLine with id ${request.ingredientLineId} not found in meal`
      );
    }

    // Create updated meal with updated ingredient line
    const updatedMeal = Meal.create({
      id: existingMeal.id,
      userId: existingMeal.userId,
      name: existingMeal.name,
      ingredientLines: existingMeal.ingredientLines.map((line) => {
        if (line.id === request.ingredientLineId) {
          return line.update({
            ingredient: newIngredient,
            quantityInGrams: request.quantityInGrams,
          });
        }
        return line;
      }),
      createdAt: existingMeal.createdAt,
      updatedAt: existingMeal.updatedAt,
    });

    // Save the updated meal
    await this.mealsRepo.saveMeal(updatedMeal);

    return updatedMeal;
  }
}
