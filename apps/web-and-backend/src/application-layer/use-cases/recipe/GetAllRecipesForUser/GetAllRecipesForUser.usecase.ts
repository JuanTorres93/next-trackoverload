import { RecipeDTO } from "shared";

import { logNoTest } from "@/utils/logNoTest";

import {
  NotFoundError,
  PermissionError,
} from "../../../../domain/common/errors";
import { RecipesRepo } from "../../../../domain/repos/RecipesRepo.port";
import { UsersRepo } from "../../../../domain/repos/UsersRepo.port";
import { toRecipeDTO } from "../../../dtos/RecipeDTO";

export type GetAllRecipesForUserUsecaseRequest = {
  actorUserId: string;
  targetUserId: string;
};

export class GetAllRecipesForUserUsecase {
  constructor(
    private recipesRepo: RecipesRepo,
    private usersRepo: UsersRepo,
  ) {}

  async execute(
    request: GetAllRecipesForUserUsecaseRequest,
  ): Promise<RecipeDTO[]> {
    if (request.actorUserId !== request.targetUserId) {
      logNoTest(
        `GetAllRecipesForUserUsecase: cannot get recipes for another user`,
      );

      throw new PermissionError("No puedes ver las recetas de otro usuario.");
    }

    const [user, recipes] = await Promise.all([
      this.usersRepo.getUserById(request.targetUserId),

      this.recipesRepo.getAllRecipesByUserId(request.targetUserId),
    ]);

    if (!user) {
      logNoTest(
        `GetAllRecipesForUserUsecase: user with id ${request.targetUserId} not found`,
      );

      throw new NotFoundError("El usuario no existe.");
    }

    return recipes.map(toRecipeDTO) || [];
  }
}
