import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { IngredientLinesRepo } from '@/domain/repos/IngredientLinesRepo.port';
import { RecipeDTO, toRecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { validateNonEmptyString } from '@/domain/common/validation';
import { NotFoundError, ValidationError } from '@/domain/common/errors';

export type AddIngredientToRecipeUsecaseRequest = {
  recipeId: string;
  userId: string;
  ingredientLine: IngredientLine;
};

export class AddIngredientToRecipeUsecase {
  constructor(
    private recipesRepo: RecipesRepo,
    private ingredientLinesRepo: IngredientLinesRepo
  ) {}

  async execute(
    request: AddIngredientToRecipeUsecaseRequest
  ): Promise<RecipeDTO> {
    validateNonEmptyString(
      request.recipeId,
      'AddIngredientToRecipeUsecase recipeId'
    );
    validateNonEmptyString(
      request.userId,
      'AddIngredientToRecipeUsecase userId'
    );

    if (!(request.ingredientLine instanceof IngredientLine)) {
      throw new ValidationError(
        'AddIngredientToRecipeUsecase: ingredientLine must be an IngredientLine instance'
      );
    }

    const existingRecipe = await this.recipesRepo.getRecipeByIdAndUserId(
      request.recipeId,
      request.userId
    );
    if (!existingRecipe) {
      throw new NotFoundError(
        `AddIngredientToRecipeUsecase: Recipe with id ${request.recipeId} not found`
      );
    }

    const existingIngredientLine =
      await this.ingredientLinesRepo.getIngredientLineById(
        request.ingredientLine.id
      );
    if (!existingIngredientLine) {
      throw new NotFoundError(
        `AddIngredientToRecipeUsecase: IngredientLine with id ${request.ingredientLine.id} not found`
      );
    }

    existingRecipe.addIngredientLine(request.ingredientLine);
    await this.recipesRepo.saveRecipe(existingRecipe);

    return toRecipeDTO(existingRecipe);
  }
}
