import { RecipeDTO, toRecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { NotFoundError } from '@/domain/common/errors';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { IngredientsRepo } from '@/domain/repos/IngredientsRepo.port';
import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';

export type AddIngredientToRecipeUsecaseRequest = {
  recipeId: string;
  userId: string;
  ingredientId: string;
  quantityInGrams: number;
};

export class AddIngredientToRecipeUsecase {
  constructor(
    private recipesRepo: RecipesRepo,
    private ingredientsRepo: IngredientsRepo
  ) {}

  async execute(
    request: AddIngredientToRecipeUsecaseRequest
  ): Promise<RecipeDTO> {
    const existingRecipe: Recipe | null =
      await this.recipesRepo.getRecipeByIdAndUserId(
        request.recipeId,
        request.userId
      );

    if (!existingRecipe) {
      throw new NotFoundError(
        `AddIngredientToRecipeUsecase: Recipe with id ${request.recipeId} not found`
      );
    }

    const ingredientToAdd = await this.ingredientsRepo.getIngredientById(
      request.ingredientId
    );

    if (!ingredientToAdd) {
      throw new NotFoundError(
        `AddIngredientToRecipeUsecase: Ingredient with id ${request.ingredientId} not found`
      );
    }

    const newIngredientLine: IngredientLine = IngredientLine.create({
      id: request.ingredientId,
      parentId: request.recipeId,
      parentType: 'recipe',
      ingredient: ingredientToAdd,
      quantityInGrams: request.quantityInGrams,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    existingRecipe.addIngredientLine(newIngredientLine);
    await this.recipesRepo.saveRecipe(existingRecipe);

    return toRecipeDTO(existingRecipe);
  }
}
