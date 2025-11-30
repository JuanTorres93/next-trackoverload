import { RecipeDTO, toRecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { NotFoundError } from '@/domain/common/errors';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type UpdateRecipeUsecaseRequest = {
  id: string;
  userId: string;
  name?: string;
  ingredientLines?: IngredientLine[];
};

export class UpdateRecipeUsecase {
  constructor(private recipesRepo: RecipesRepo, private usersRepo: UsersRepo) {}

  async execute(request: UpdateRecipeUsecaseRequest): Promise<RecipeDTO> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `UpdateRecipeUsecase: user with id ${request.userId} not found`
      );
    }
    const existingRecipe = await this.recipesRepo.getRecipeByIdAndUserId(
      request.id,
      request.userId
    );
    if (!existingRecipe) {
      throw new NotFoundError(
        `UpdateRecipeUsecase: Recipe with id ${request.id} not found`
      );
    }

    if (request.name !== undefined) {
      existingRecipe.rename(request.name);
    }

    await this.recipesRepo.saveRecipe(existingRecipe);

    return toRecipeDTO(existingRecipe);
  }
}
