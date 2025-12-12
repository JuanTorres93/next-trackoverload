import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { ImageManager } from '@/domain/services/ImageManager.port';

import { NotFoundError } from '@/domain/common/errors';

export type DeleteRecipeUsecaseRequest = {
  id: string;
  userId: string;
};

export class DeleteRecipeUsecase {
  constructor(
    private recipesRepo: RecipesRepo,
    private imageManager: ImageManager,
    private usersRepo: UsersRepo
  ) {}

  async execute(request: DeleteRecipeUsecaseRequest): Promise<void> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `DeleteRecipeUsecase: user with id ${request.userId} not found`
      );
    }
    const existingRecipe = await this.recipesRepo.getRecipeByIdAndUserId(
      request.id,
      request.userId
    );

    if (!existingRecipe) {
      throw new NotFoundError(
        `DeleteRecipeUsecase: Recipe with id ${request.id} not found`
      );
    }

    // Remove associated image if exists
    if (existingRecipe.imageUrl) {
      await this.imageManager.deleteImage(existingRecipe.imageUrl);
    }

    await this.recipesRepo.deleteRecipe(request.id);
  }
}
