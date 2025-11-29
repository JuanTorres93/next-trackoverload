import { IngredientsRepo } from '@/domain/repos/IngredientsRepo.port';
import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import {
  IngredientLineDTO,
  toIngredientLineDTO,
} from '@/application-layer/dtos/IngredientLineDTO';
import {
  validateNonEmptyString,
  validateGreaterThanZero,
} from '@/domain/common/validation';
import {
  NotFoundError,
  ValidationError,
  AuthError,
} from '@/domain/common/errors';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { Meal } from '@/domain/entities/meal/Meal';

export type UpdateIngredientLineUsecaseRequest = {
  userId: string;
  parentEntityType: 'recipe' | 'meal';
  parentEntityId: string;
  ingredientLineId: string;
  ingredientId?: string;
  quantityInGrams?: number;
};

export class UpdateIngredientLineUsecase {
  constructor(
    private ingredientsRepo: IngredientsRepo,
    private recipesRepo: RecipesRepo,
    private mealsRepo: MealsRepo
  ) {}

  async execute(
    request: UpdateIngredientLineUsecaseRequest
  ): Promise<IngredientLineDTO> {
    validateNonEmptyString(
      request.userId,
      'UpdateIngredientLineUsecase userId'
    );
    validateNonEmptyString(
      request.parentEntityId,
      'UpdateIngredientLineUsecase parentEntityId'
    );
    validateNonEmptyString(
      request.ingredientLineId,
      'UpdateIngredientLineUsecase ingredientLineId'
    );

    if (
      request.parentEntityType !== 'recipe' &&
      request.parentEntityType !== 'meal'
    ) {
      throw new ValidationError(
        'UpdateIngredientLineUsecase: parentEntityType must be "recipe" or "meal"'
      );
    }

    // Ensure at least one field to update is provided
    if (
      request.ingredientId === undefined &&
      request.quantityInGrams === undefined
    ) {
      throw new ValidationError(
        'UpdateIngredientLineUsecase: At least one of ingredientId or quantityInGrams must be provided'
      );
    }

    // Validate quantityInGrams if provided
    if (request.quantityInGrams !== undefined)
      validateGreaterThanZero(
        request.quantityInGrams,
        'UpdateIngredientLineUsecase quantityInGrams'
      );

    // Validate user has access to the parent entity and that the ingredient line exists in it
    let parentEntity: {
      ingredientLines: IngredientLine[];
      userId?: string;
    } | null = null;
    let parentEntityType = null;

    if (request.parentEntityType === 'recipe') {
      parentEntity = await this.recipesRepo.getRecipeById(
        request.parentEntityId
      );
      parentEntityType = 'Recipe';
    } else if (request.parentEntityType === 'meal') {
      parentEntity = await this.mealsRepo.getMealById(request.parentEntityId);
      parentEntityType = 'Meal';
    } else {
      throw new ValidationError(
        'UpdateIngredientLineUsecase: parentEntityType must be "recipe" or "meal"'
      );
    }

    if (!parentEntity) {
      throw new NotFoundError(
        `UpdateIngredientLineUsecase: ${parentEntityType} with id ${request.parentEntityId} not found`
      );
    }
    if (parentEntity.userId !== request.userId) {
      throw new AuthError(
        `UpdateIngredientLineUsecase: ${parentEntityType} with id ${request.parentEntityId} not found for user ${request.userId}`
      );
    }

    // Verify the ingredient line exists in the parent entity
    const existingIngredientLine = parentEntity!.ingredientLines.find(
      (line) => line.id === request.ingredientLineId
    );

    if (!existingIngredientLine) {
      throw new NotFoundError(
        `UpdateIngredientLineUsecase: IngredientLine with id ${request.ingredientLineId} does not belong to the specified ${request.parentEntityType}`
      );
    }

    // Get the new ingredient if ingredientId is provided
    let newIngredient: Ingredient | undefined;
    if (request.ingredientId !== undefined) {
      validateNonEmptyString(
        request.ingredientId,
        'UpdateIngredientLineUsecase ingredientId'
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

    // Create the updated ingredient line
    existingIngredientLine.update({
      ingredient: newIngredient,
      quantityInGrams: request.quantityInGrams,
    });

    // Save the updated parent entity
    if (request.parentEntityType === 'recipe') {
      await this.recipesRepo.saveRecipe(parentEntity as Recipe);
    } else if (request.parentEntityType === 'meal') {
      await this.mealsRepo.saveMeal(parentEntity as Meal);
    }

    return toIngredientLineDTO(existingIngredientLine);
  }
}
