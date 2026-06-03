import { RecipeDTO } from "shared";

import { logNoTest } from "@/utils/logNoTest";

import { NotFoundError } from "../../../../domain/common/errors";
import { RecipesRepo } from "../../../../domain/repos/RecipesRepo.port";
import { UsersRepo } from "../../../../domain/repos/UsersRepo.port";
import { toRecipeDTO } from "../../../dtos/RecipeDTO";

export type UpdateRecipeUsecaseRequest = {
  id: string;
  userId: string;
  name?: string;
};

export class UpdateRecipeUsecase {
  constructor(
    private recipesRepo: RecipesRepo,
    private usersRepo: UsersRepo,
  ) {}

  async execute(request: UpdateRecipeUsecaseRequest): Promise<RecipeDTO> {
    const [user, existingRecipe] = await Promise.all([
      this.usersRepo.getUserById(request.userId),

      this.recipesRepo.getRecipeByIdAndUserId(request.id, request.userId),
    ]);

    if (!user) {
      logNoTest(
        `UpdateRecipeUsecase: user with id ${request.userId} not found`,
      );

      throw new NotFoundError("El usuario no existe.");
    }

    if (!existingRecipe) {
      logNoTest(`UpdateRecipeUsecase: Recipe with id ${request.id} not found`);

      throw new NotFoundError("La receta no existe.");
    }

    if (request.name !== undefined) {
      existingRecipe.rename(request.name);
    }

    await this.recipesRepo.saveRecipe(existingRecipe);

    return toRecipeDTO(existingRecipe);
  }
}
