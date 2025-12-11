import {
  IngredientLineDTO,
  toIngredientLineDTO,
} from '@/application-layer/dtos/IngredientLineDTO';
import { AuthError, NotFoundError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLineCreateProps } from '@/domain/entities/ingredientline/IngredientLine';
import { Meal } from '@/domain/entities/meal/Meal';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { IngredientsRepo } from '@/domain/repos/IngredientsRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';

export type UpdateIngredientLineUsecaseRequest = {
  userId: string;
  parentEntityType: IngredientLineCreateProps['parentType'];
  parentEntityId: string;
  ingredientLineId: string;
  ingredientId?: string;
  quantityInGrams?: number;
};

export class UpdateIngredientLineUsecase {
  constructor(
    private ingredientsRepo: IngredientsRepo,
    private recipesRepo: RecipesRepo,
    private mealsRepo: MealsRepo,
    private usersRepo: UsersRepo
  ) {}

  async execute(
    request: UpdateIngredientLineUsecaseRequest
  ): Promise<IngredientLineDTO> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `UpdateIngredientLineUsecase: User with id ${request.userId} not found`
      );
    }

    // Get parent entity from repo
    let parentEntity: Recipe | Meal | null = null;

    if (request.parentEntityType === 'recipe') {
      parentEntity = await this.recipesRepo.getRecipeById(
        request.parentEntityId
      );
    } else if (request.parentEntityType === 'meal') {
      parentEntity = await this.mealsRepo.getMealById(request.parentEntityId);
    }

    if (!parentEntity) {
      throw new NotFoundError(
        `UpdateIngredientLineUsecase: ${request.parentEntityType} with id ${request.parentEntityId} not found`
      );
    }

    // Validate user owns parent entity
    if (parentEntity.userId !== request.userId) {
      throw new AuthError(
        `UpdateIngredientLineUsecase: ${request.parentEntityType} with id ${request.parentEntityId} not found for user ${request.userId}`
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
      const foundIngredient = await this.ingredientsRepo.getIngredientById(
        request.ingredientId
      );

      if (!foundIngredient) {
        throw new NotFoundError(
          `UpdateIngredientLineUsecase: Ingredient with id ${request.ingredientId} not found`
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
