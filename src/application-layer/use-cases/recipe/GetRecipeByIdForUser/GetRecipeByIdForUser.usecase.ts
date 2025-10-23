import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { RecipeDTO, toRecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { validateNonEmptyString } from '@/domain/common/validation';

export type GetRecipeByIdForUserUsecaseRequest = {
  id: string;
  userId: string;
};

export class GetRecipeByIdForUserUsecase {
  constructor(private recipesRepo: RecipesRepo) {}

  async execute(
    request: GetRecipeByIdForUserUsecaseRequest
  ): Promise<RecipeDTO | null> {
    validateNonEmptyString(request.id, 'GetRecipeByIdForUserUsecase id');
    validateNonEmptyString(
      request.userId,
      'GetRecipeByIdForUserUsecase userId'
    );

    const recipe = await this.recipesRepo.getRecipeByIdAndUserId(
      request.id,
      request.userId
    );
    return recipe ? toRecipeDTO(recipe) : null;
  }
}
