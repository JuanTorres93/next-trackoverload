import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { validateNonEmptyString } from '@/domain/common/validation';
import { NotFoundError, ValidationError } from '@/domain/common/errors';

export type AddIngredientToRecipeUsecaseRequest = {
  recipeId: string;
  ingredientLine: IngredientLine;
};

export class AddIngredientToRecipeUsecase {
  constructor(private recipesRepo: RecipesRepo) {}

  async execute(request: AddIngredientToRecipeUsecaseRequest): Promise<Recipe> {
    validateNonEmptyString(
      request.recipeId,
      'AddIngredientToRecipeUsecase recipeId'
    );

    if (!(request.ingredientLine instanceof IngredientLine)) {
      throw new ValidationError(
        'AddIngredientToRecipeUsecase: ingredientLine must be an IngredientLine instance'
      );
    }

    const existingRecipe = await this.recipesRepo.getRecipeById(
      request.recipeId
    );
    if (!existingRecipe) {
      throw new NotFoundError(`Recipe with id ${request.recipeId} not found`);
    }

    existingRecipe.addIngredientLine(request.ingredientLine);
    await this.recipesRepo.saveRecipe(existingRecipe);

    return existingRecipe;
  }
}
