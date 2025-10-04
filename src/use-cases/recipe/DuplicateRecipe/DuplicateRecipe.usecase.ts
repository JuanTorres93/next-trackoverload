import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { validateNonEmptyString } from '@/domain/common/validation';
import { NotFoundError } from '@/domain/common/errors';
import { v4 as uuidv4 } from 'uuid';

export type DuplicateRecipeUsecaseRequest = {
  recipeId: string;
  newName?: string;
};

export class DuplicateRecipeUsecase {
  constructor(private recipesRepo: RecipesRepo) {}

  async execute(request: DuplicateRecipeUsecaseRequest): Promise<Recipe> {
    validateNonEmptyString(request.recipeId, 'DuplicateRecipeUsecase recipeId');

    const originalRecipe = await this.recipesRepo.getRecipeById(
      request.recipeId
    );
    if (!originalRecipe) {
      throw new NotFoundError(
        `DuplicateRecipeUsecase Recipe with id ${request.recipeId} not found`
      );
    }

    const newName = request.newName || `${originalRecipe.name} (Copy)`;

    const duplicatedRecipe = Recipe.create({
      id: uuidv4(),
      name: newName,
      ingredientLines: originalRecipe.ingredientLines,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.recipesRepo.saveRecipe(duplicatedRecipe);

    return duplicatedRecipe;
  }
}
