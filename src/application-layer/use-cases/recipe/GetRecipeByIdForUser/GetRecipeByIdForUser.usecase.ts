import { RecipeDTO, toRecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { NotFoundError } from '@/domain/common/errors';
import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type GetRecipeByIdForUserUsecaseRequest = {
  id: string;
  userId: string;
};

export class GetRecipeByIdForUserUsecase {
  constructor(private recipesRepo: RecipesRepo, private usersRepo: UsersRepo) {}

  async execute(
    request: GetRecipeByIdForUserUsecaseRequest
  ): Promise<RecipeDTO | null> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `GetRecipeByIdForUserUsecase: user with id ${request.userId} not found`
      );
    }
    const recipe = await this.recipesRepo.getRecipeByIdAndUserId(
      request.id,
      request.userId
    );
    return recipe ? toRecipeDTO(recipe) : null;
  }
}
