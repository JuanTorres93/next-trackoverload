import { RecipeDTO, toRecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { NotFoundError } from '@/domain/common/errors';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';

export type UpdateRecipeUsecaseRequest = {
  id: string;
  userId: string;
  name?: string;
  ingredientLines?: IngredientLine[];
};

export class UpdateRecipeUsecase {
  constructor(private recipesRepo: RecipesRepo) {}

  async execute(request: UpdateRecipeUsecaseRequest): Promise<RecipeDTO> {
    const existingRecipe = await this.recipesRepo.getRecipeByIdAndUserId(
      request.id,
      request.userId
    );
    if (!existingRecipe) {
      throw new NotFoundError(
        `UpdateRecipeUsecase: Recipe with id ${request.id} not found`
      );
    }

    if (request.name !== undefined) {
      existingRecipe.rename(request.name);
    }

    await this.recipesRepo.saveRecipe(existingRecipe);

    return toRecipeDTO(existingRecipe);
  }
}
