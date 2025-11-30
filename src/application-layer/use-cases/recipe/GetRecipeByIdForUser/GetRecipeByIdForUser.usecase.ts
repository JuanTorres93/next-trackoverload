import { RecipeDTO, toRecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';

export type GetRecipeByIdForUserUsecaseRequest = {
  id: string;
  userId: string;
};

export class GetRecipeByIdForUserUsecase {
  constructor(private recipesRepo: RecipesRepo) {}

  async execute(
    request: GetRecipeByIdForUserUsecaseRequest
  ): Promise<RecipeDTO | null> {
    const recipe = await this.recipesRepo.getRecipeByIdAndUserId(
      request.id,
      request.userId
    );
    return recipe ? toRecipeDTO(recipe) : null;
  }
}
