import { RecipeDTO, toRecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { NotFoundError, PermissionError } from '@/domain/common/errors';
import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type GetAllRecipesForUserUsecaseRequest = {
  actorUserId: string;
  targetUserId: string;
};

export class GetAllRecipesForUserUsecase {
  constructor(
    private recipesRepo: RecipesRepo,
    private usersRepo: UsersRepo,
  ) {}

  async execute(
    request: GetAllRecipesForUserUsecaseRequest,
  ): Promise<RecipeDTO[]> {
    if (request.actorUserId !== request.targetUserId) {
      throw new PermissionError(
        `GetAllRecipesForUserUsecase: cannot get recipes for another user`,
      );
    }

    const [user, recipes] = await Promise.all([
      this.usersRepo.getUserById(request.targetUserId),

      this.recipesRepo.getAllRecipesByUserId(request.targetUserId),
    ]);

    if (!user) {
      throw new NotFoundError(
        `GetAllRecipesForUserUsecase: user with id ${request.targetUserId} not found`,
      );
    }

    return recipes.map(toRecipeDTO) || [];
  }
}
