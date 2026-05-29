import { logNoTest } from "@/utils/logNoTest";

import { NotFoundError } from "../../../../domain/common/errors";
import { ImagesRepo } from "../../../../domain/repos/ImagesRepo.port";
import { RecipesRepo } from "../../../../domain/repos/RecipesRepo.port";
import { UsersRepo } from "../../../../domain/repos/UsersRepo.port";

export type DeleteRecipeUsecaseRequest = {
  id: string;
  userId: string;
};

export class DeleteRecipeUsecase {
  constructor(
    private recipesRepo: RecipesRepo,
    private imagesRepo: ImagesRepo,
    private usersRepo: UsersRepo,
  ) {}

  async execute(request: DeleteRecipeUsecaseRequest): Promise<void> {
    const [user, existingRecipe] = await Promise.all([
      this.usersRepo.getUserById(request.userId),

      this.recipesRepo.getRecipeByIdAndUserId(request.id, request.userId),
    ]);

    if (!user) {
      logNoTest(
        `DeleteRecipeUsecase: user with id ${request.userId} not found`,
      );

      throw new NotFoundError("El usuario no existe.");
    }

    if (!existingRecipe) {
      logNoTest(`DeleteRecipeUsecase: Recipe with id ${request.id} not found`);

      throw new NotFoundError("La receta no existe.");
    }

    // Remove associated image if exists
    if (existingRecipe.imageUrl) {
      await this.imagesRepo.deleteByUrl(existingRecipe.imageUrl);
    }

    await this.recipesRepo.deleteRecipe(request.id);
  }
}
