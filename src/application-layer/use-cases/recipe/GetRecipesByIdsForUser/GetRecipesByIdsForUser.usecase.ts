import { RecipeDTO, toRecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type GetRecipesByIdsForUserUsecaseRequest = {
  ids: string[];
  userId: string;
};

export class GetRecipesByIdsForUserUsecase {
  constructor(private recipesRepo: RecipesRepo, private usersRepo: UsersRepo) {}

  async execute(
    request: GetRecipesByIdsForUserUsecaseRequest
  ): Promise<RecipeDTO[]> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `GetRecipesByIdsForUserUsecase: user with id ${request.userId} not found`
      );
    }

    if (!Array.isArray(request.ids) || request.ids.length === 0) {
      throw new ValidationError(
        'GetRecipesByIdsForUserUsecase: ids must be a non-empty array'
      );
    }

    const uniqueIds = Array.from(new Set(request.ids));

    const recipes = await Promise.all(
      uniqueIds.map((id) =>
        this.recipesRepo.getRecipeByIdAndUserId(id, request.userId)
      )
    );

    // Filter out null values (recipes that weren't found) and convert to DTOs
    return recipes.filter((recipe) => recipe !== null).map(toRecipeDTO);
  }
}
