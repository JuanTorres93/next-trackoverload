import { logNoTest } from "@/domain/utils/logNoTest";

import { NotFoundError } from "../../../../domain/common/errors";
import { RecipesRepo } from "../../../../domain/repos/RecipesRepo.port";
import { UsersRepo } from "../../../../domain/repos/UsersRepo.port";
import { RecipeDTO, toRecipeDTO } from "../../../dtos/RecipeDTO";

export type GetRecipeByIdForUserUsecaseRequest = {
  id: string;
  userId: string;
};

export class GetRecipeByIdForUserUsecase {
  constructor(
    private recipesRepo: RecipesRepo,
    private usersRepo: UsersRepo,
  ) {}

  async execute(
    request: GetRecipeByIdForUserUsecaseRequest,
  ): Promise<RecipeDTO | null> {
    const [user, recipe] = await Promise.all([
      this.usersRepo.getUserById(request.userId),

      this.recipesRepo.getRecipeByIdAndUserId(request.id, request.userId),
    ]);

    if (!user) {
      logNoTest(
        `GetRecipeByIdForUserUsecase: user with id ${request.userId} not found`,
      );

      throw new NotFoundError("El usuario no existe.");
    }

    return recipe ? toRecipeDTO(recipe) : null;
  }
}
