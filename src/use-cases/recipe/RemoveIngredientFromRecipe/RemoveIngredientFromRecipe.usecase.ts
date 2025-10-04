import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { validateNonEmptyString } from '@/domain/common/validation';
import { NotFoundError } from '@/domain/common/errors';

export type RemoveIngredientFromRecipeUsecaseRequest = {
  recipeId: string;
  ingredientId: string;
};

export class RemoveIngredientFromRecipeUsecase {
  constructor(private recipesRepo: RecipesRepo) {}

  async execute(
    request: RemoveIngredientFromRecipeUsecaseRequest
  ): Promise<Recipe> {
    validateNonEmptyString(
      request.recipeId,
      'RemoveIngredientFromRecipeUsecase recipeId'
    );
    validateNonEmptyString(
      request.ingredientId,
      'RemoveIngredientFromRecipeUsecase ingredientId'
    );

    const existingRecipe = await this.recipesRepo.getRecipeById(
      request.recipeId
    );
    if (!existingRecipe) {
      throw new NotFoundError(
        `RemoveIngredientFromRecipeUsecase: Recipe with id ${request.recipeId} not found`
      );
    }

    // NOTE: validation done in the entity method
    existingRecipe.removeIngredientLineByIngredientId(request.ingredientId);

    await this.recipesRepo.saveRecipe(existingRecipe);

    return existingRecipe;
  }
}
