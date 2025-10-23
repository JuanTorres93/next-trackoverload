import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { RecipeDTO, toRecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { validateNonEmptyString } from '@/domain/common/validation';

export type GetAllRecipesForUserUsecaseRequest = {
  userId: string;
};

export class GetAllRecipesForUserUsecase {
  constructor(private recipesRepo: RecipesRepo) {}

  async execute(
    request: GetAllRecipesForUserUsecaseRequest
  ): Promise<RecipeDTO[]> {
    validateNonEmptyString(
      request.userId,
      'GetAllRecipesForUserUsecase userId'
    );

    const recipes = await this.recipesRepo.getAllRecipesByUserId(
      request.userId
    );

    return recipes.map(toRecipeDTO) || [];
  }
}
