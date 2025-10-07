import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { validateNonEmptyString } from '@/domain/common/validation';
import { ValidationError } from '@/domain/common/errors';

export type GetRecipesByIdsForUserUsecaseRequest = {
  ids: string[];
  userId: string;
};

export class GetRecipesByIdsForUserUsecase {
  constructor(private recipesRepo: RecipesRepo) {}

  async execute(
    request: GetRecipesByIdsForUserUsecaseRequest
  ): Promise<Recipe[]> {
    if (!Array.isArray(request.ids) || request.ids.length === 0) {
      throw new ValidationError(
        'GetRecipesByIdsForUserUsecase: ids must be a non-empty array'
      );
    }

    validateNonEmptyString(
      request.userId,
      'GetRecipesByIdsForUserUsecase userId'
    );

    const uniqueIds = Array.from(new Set(request.ids));

    uniqueIds.forEach((id) => {
      validateNonEmptyString(id, `GetRecipesByIdsForUserUsecase id  ${id}`);
    });

    const recipes = await Promise.all(
      uniqueIds.map((id) =>
        this.recipesRepo.getRecipeByIdAndUserId(id, request.userId)
      )
    );

    // Filter out null values (recipes that weren't found)
    return recipes.filter((recipe): recipe is Recipe => recipe !== null);
  }
}
