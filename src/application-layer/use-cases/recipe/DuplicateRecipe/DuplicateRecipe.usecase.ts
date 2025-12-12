import { RecipeDTO, toRecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

import { NotFoundError } from '@/domain/common/errors';
import { v4 as uuidv4 } from 'uuid';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';

export type DuplicateRecipeUsecaseRequest = {
  recipeId: string;
  userId: string;
  newName?: string;
};

export class DuplicateRecipeUsecase {
  constructor(private recipesRepo: RecipesRepo, private usersRepo: UsersRepo) {}

  async execute(request: DuplicateRecipeUsecaseRequest): Promise<RecipeDTO> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `DuplicateRecipeUsecase: user with id ${request.userId} not found`
      );
    }
    const originalRecipe = await this.recipesRepo.getRecipeByIdAndUserId(
      request.recipeId,
      request.userId
    );
    if (!originalRecipe) {
      throw new NotFoundError(
        `DuplicateRecipeUsecase: Recipe with id ${request.recipeId} not found`
      );
    }

    const newRecipeId = uuidv4();
    const newName = request.newName || `${originalRecipe.name} (Copy)`;

    const duplicatedIngredientLines: IngredientLine[] = [];

    // Duplicate ingredient lines to their own instances
    for (const ingredientline of originalRecipe.ingredientLines) {
      const newIngredientLine = IngredientLine.create({
        id: uuidv4(),
        parentId: newRecipeId,
        parentType: 'recipe',
        quantityInGrams: ingredientline.quantityInGrams,
        ingredient: ingredientline.ingredient,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      duplicatedIngredientLines.push(newIngredientLine);
    }

    const duplicatedRecipe = Recipe.create({
      id: newRecipeId,
      userId: request.userId,
      name: newName,
      ingredientLines: duplicatedIngredientLines,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.recipesRepo.saveRecipe(duplicatedRecipe);

    return toRecipeDTO(duplicatedRecipe);
  }
}
