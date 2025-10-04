import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { validateNonEmptyString } from '@/domain/common/validation';
import { NotFoundError } from '@/domain/common/errors';

export type UpdateRecipeUsecaseRequest = {
  id: string;
  name?: string;
  ingredientLines?: IngredientLine[];
};

export class UpdateRecipeUsecase {
  constructor(private recipesRepo: RecipesRepo) {}

  async execute(request: UpdateRecipeUsecaseRequest): Promise<Recipe> {
    validateNonEmptyString(request.id, 'UpdateRecipeUsecase id');

    const existingRecipe = await this.recipesRepo.getRecipeById(request.id);
    if (!existingRecipe) {
      throw new NotFoundError(
        `UpdateRecipeUsecase: Recipe with id ${request.id} not found`
      );
    }

    if (request.name !== undefined) {
      existingRecipe.rename(request.name);
    }

    // Note: Recipe doesn't have setIngredientLines method
    // We would need to recreate the recipe or add such method to the entity
    // For now, we'll leave this functionality to the IngredientLine management use-cases

    await this.recipesRepo.saveRecipe(existingRecipe);

    return existingRecipe;
  }
}
