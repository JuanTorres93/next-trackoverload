import { RecipeDTO, toRecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';

export type GetAllRecipesForUserUsecaseRequest = {
  userId: string;
};

export class GetAllRecipesForUserUsecase {
  constructor(private recipesRepo: RecipesRepo) {}

  async execute(
    request: GetAllRecipesForUserUsecaseRequest
  ): Promise<RecipeDTO[]> {
    const recipes = await this.recipesRepo.getAllRecipesByUserId(
      request.userId
    );

    return recipes.map(toRecipeDTO) || [];
  }
}
