import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { RecipeDTO, toRecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { validateNonEmptyString } from '@/domain/common/validation';
import { Id } from '@/domain/types/Id/Id';

import { NotFoundError } from '@/domain/common/errors';
import { v4 as uuidv4 } from 'uuid';

export type DuplicateRecipeUsecaseRequest = {
  recipeId: string;
  userId: string;
  newName?: string;
};

export class DuplicateRecipeUsecase {
  constructor(private recipesRepo: RecipesRepo) {}

  async execute(request: DuplicateRecipeUsecaseRequest): Promise<RecipeDTO> {
    validateNonEmptyString(request.recipeId, 'DuplicateRecipeUsecase recipeId');
    validateNonEmptyString(request.userId, 'DuplicateRecipeUsecase userId');

    const originalRecipe = await this.recipesRepo.getRecipeByIdAndUserId(
      request.recipeId,
      request.userId
    );
    if (!originalRecipe) {
      throw new NotFoundError(
        `DuplicateRecipeUsecase Recipe with id ${request.recipeId} not found`
      );
    }

    const newName = request.newName || `${originalRecipe.name} (Copy)`;

    const duplicatedRecipe = Recipe.create({
      id: Id.create(uuidv4()),
      userId: request.userId,
      name: newName,
      ingredientLines: originalRecipe.ingredientLines,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.recipesRepo.saveRecipe(duplicatedRecipe);

    return toRecipeDTO(duplicatedRecipe);
  }
}
