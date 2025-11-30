import { RecipeDTO, toRecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { NotFoundError } from '@/domain/common/errors';
import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';

export type RemoveIngredientFromRecipeUsecaseRequest = {
  recipeId: string;
  userId: string;
  ingredientId: string;
};

export class RemoveIngredientFromRecipeUsecase {
  constructor(private recipesRepo: RecipesRepo) {}

  async execute(
    request: RemoveIngredientFromRecipeUsecaseRequest
  ): Promise<RecipeDTO> {
    const existingRecipe = await this.recipesRepo.getRecipeByIdAndUserId(
      request.recipeId,
      request.userId
    );
    if (!existingRecipe) {
      throw new NotFoundError(
        `RemoveIngredientFromRecipeUsecase: Recipe with id ${request.recipeId} not found`
      );
    }

    existingRecipe.removeIngredientLineByIngredientId(request.ingredientId);

    await this.recipesRepo.saveRecipe(existingRecipe);

    return toRecipeDTO(existingRecipe);
  }
}
