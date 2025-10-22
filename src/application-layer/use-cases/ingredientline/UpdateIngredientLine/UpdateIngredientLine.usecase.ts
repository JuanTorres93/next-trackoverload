import { IngredientLinesRepo } from '@/domain/repos/IngredientLinesRepo.port';
import { IngredientsRepo } from '@/domain/repos/IngredientsRepo.port';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import {
  validateNonEmptyString,
  validateGreaterThanZero,
} from '@/domain/common/validation';
import { NotFoundError, ValidationError } from '@/domain/common/errors';

export type UpdateIngredientLineUsecaseRequest = {
  ingredientLineId: string;
  ingredientId?: string;
  quantityInGrams?: number;
};

export class UpdateIngredientLineUsecase {
  constructor(
    private ingredientLinesRepo: IngredientLinesRepo,
    private ingredientsRepo: IngredientsRepo
  ) {}

  async execute(
    request: UpdateIngredientLineUsecaseRequest
  ): Promise<IngredientLine> {
    validateNonEmptyString(
      request.ingredientLineId,
      'UpdateIngredientLineUsecase ingredientLineId'
    );

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

    // Get the existing ingredient line
    const existingIngredientLine =
      await this.ingredientLinesRepo.getIngredientLineById(
        request.ingredientLineId
      );

    if (!existingIngredientLine) {
      throw new NotFoundError(
        `UpdateIngredientLineUsecase: IngredientLine with id ${request.ingredientLineId} not found`
      );
    }

    // Create the updated ingredient line
    const updatedIngredientLine = existingIngredientLine.update({
      ingredient: newIngredient,
      quantityInGrams: request.quantityInGrams,
    });

    // Save the updated ingredient line
    await this.ingredientLinesRepo.saveIngredientLine(updatedIngredientLine);

    return updatedIngredientLine;
  }
}
