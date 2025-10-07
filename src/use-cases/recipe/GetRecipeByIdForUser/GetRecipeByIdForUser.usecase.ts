import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { validateNonEmptyString } from '@/domain/common/validation';

export type GetRecipeByIdForUserUsecaseRequest = {
  id: string;
  userId: string;
};

export class GetRecipeByIdForUserUsecase {
  constructor(private recipesRepo: RecipesRepo) {}

  async execute(
    request: GetRecipeByIdForUserUsecaseRequest
  ): Promise<Recipe | null> {
    validateNonEmptyString(request.id, 'GetRecipeByIdForUserUsecase id');
    validateNonEmptyString(
      request.userId,
      'GetRecipeByIdForUserUsecase userId'
    );

    const recipe = await this.recipesRepo.getRecipeByIdAndUserId(
      request.id,
      request.userId
    );
    return recipe || null;
  }
}
