import { RecipeDTO, toRecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { NotFoundError } from '@/domain/common/errors';
import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type GetAllRecipesForUserUsecaseRequest = {
  userId: string;
};

export class GetAllRecipesForUserUsecase {
  constructor(private recipesRepo: RecipesRepo, private usersRepo: UsersRepo) {}

  async execute(
    request: GetAllRecipesForUserUsecaseRequest
  ): Promise<RecipeDTO[]> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `GetAllRecipesForUserUsecase: user with id ${request.userId} not found`
      );
    }
    const recipes = await this.recipesRepo.getAllRecipesByUserId(
      request.userId
    );

    return recipes.map(toRecipeDTO) || [];
  }
}
