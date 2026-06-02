import { RecipeDTO } from "shared";

import { logNoTest } from "@/utils/logNoTest";

import { NotFoundError } from "../../../../domain/common/errors";
import { RecipesRepo } from "../../../../domain/repos/RecipesRepo.port";
import { UsersRepo } from "../../../../domain/repos/UsersRepo.port";
import { toRecipeDTO } from "../../../dtos/RecipeDTO";

export type RemoveIngredientFromRecipeUsecaseRequest = {
  recipeId: string;
  userId: string;
  ingredientId: string;
};

export class RemoveIngredientFromRecipeUsecase {
  constructor(
    private recipesRepo: RecipesRepo,
    private usersRepo: UsersRepo,
  ) {}

  async execute(
    request: RemoveIngredientFromRecipeUsecaseRequest,
  ): Promise<RecipeDTO> {
    const [user, existingRecipe] = await Promise.all([
      this.usersRepo.getUserById(request.userId),

      this.recipesRepo.getRecipeByIdAndUserId(request.recipeId, request.userId),
    ]);

    if (!user) {
      logNoTest(
        `RemoveIngredientFromRecipeUsecase: user with id ${request.userId} not found`,
      );

      throw new NotFoundError("El usuario no existe.");
    }

    if (!existingRecipe) {
      logNoTest(
        `RemoveIngredientFromRecipeUsecase: Recipe with id ${request.recipeId} not found`,
      );

      throw new NotFoundError("La receta no existe.");
    }

    existingRecipe.removeIngredientLineByIngredientId(request.ingredientId);

    await this.recipesRepo.saveRecipe(existingRecipe);

    return toRecipeDTO(existingRecipe);
  }
}
