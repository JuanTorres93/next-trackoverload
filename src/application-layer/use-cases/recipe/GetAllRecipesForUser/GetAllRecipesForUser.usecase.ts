import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { validateNonEmptyString } from '@/domain/common/validation';

export type GetAllRecipesForUserUsecaseRequest = {
  userId: string;
};

export class GetAllRecipesForUserUsecase {
  constructor(private recipesRepo: RecipesRepo) {}

  async execute(
    request: GetAllRecipesForUserUsecaseRequest
  ): Promise<Recipe[]> {
    validateNonEmptyString(
      request.userId,
      'GetAllRecipesForUserUsecase userId'
    );

    const recipes = await this.recipesRepo.getAllRecipesByUserId(
      request.userId
    );

    return recipes || [];
  }
}
