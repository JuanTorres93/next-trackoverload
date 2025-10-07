import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { validateNonEmptyString } from '@/domain/common/validation';
import { NotFoundError } from '@/domain/common/errors';

export type DeleteRecipeUsecaseRequest = {
  id: string;
  userId: string;
};

export class DeleteRecipeUsecase {
  constructor(private recipesRepo: RecipesRepo) {}

  async execute(request: DeleteRecipeUsecaseRequest): Promise<void> {
    validateNonEmptyString(request.id, 'DeleteRecipeUsecase id');
    validateNonEmptyString(request.userId, 'DeleteRecipeUsecase userId');

    const existingRecipe = await this.recipesRepo.getRecipeByIdAndUserId(
      request.id,
      request.userId
    );

    if (!existingRecipe) {
      throw new NotFoundError(`Recipe with id ${request.id} not found`);
    }

    await this.recipesRepo.deleteRecipe(request.id);
  }
}
