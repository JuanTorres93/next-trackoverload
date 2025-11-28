import { IngredientsRepo } from '@/domain/repos/IngredientsRepo.port';
import {
  Ingredient,
  IngredientUpdateProps,
} from '@/domain/entities/ingredient/Ingredient';
import {
  IngredientDTO,
  toIngredientDTO,
} from '@/application-layer/dtos/IngredientDTO';
import { Id } from '@/domain/value-objects/Id/Id';
import { NotFoundError } from '@/domain/common/errors';
import { validateNonEmptyString } from '@/domain/common/validation';

export type UpdateIngredientUsecaseRequest = {
  id: string;
  name?: string;
  calories?: number;
  protein?: number;
};

export class UpdateIngredientUsecase {
  constructor(private ingredientsRepo: IngredientsRepo) {}

  async execute(
    request: UpdateIngredientUsecaseRequest
  ): Promise<IngredientDTO> {
    validateNonEmptyString(request.id, 'UpdateIngredientUsecase');

    const existingIngredient = await this.ingredientsRepo.getIngredientById(
      request.id
    );

    if (!existingIngredient) {
      throw new NotFoundError('Ingredient not found');
    }

    const patch: IngredientUpdateProps = {};

    // NOTE: Validation is done in the entity's update method
    if (request.name !== undefined) patch.name = request.name;
    if (request.calories !== undefined) patch.calories = request.calories;
    if (request.protein !== undefined) patch.protein = request.protein;

    if (Object.keys(patch).length > 0) {
      // Create a new ingredient with the same properties
      const updatedIngredient = Ingredient.create({
        id: Id.create(existingIngredient.id),
        name: existingIngredient.name,
        nutritionalInfoPer100g: {
          calories: existingIngredient.nutritionalInfoPer100g.calories,
          protein: existingIngredient.nutritionalInfoPer100g.protein,
        },
        createdAt: existingIngredient.createdAt,
        updatedAt: existingIngredient.updatedAt,
      });

      // Apply the updates using the entity's update method
      updatedIngredient.update(patch);

      await this.ingredientsRepo.saveIngredient(updatedIngredient);

      return toIngredientDTO(updatedIngredient);
    }

    return toIngredientDTO(existingIngredient); // No changes made, return the original
  }
}
