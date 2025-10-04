import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { validateNonEmptyString } from '@/domain/common/validation';
import { ValidationError } from '@/domain/common/errors';

export type GetRecipesByIdsUsecaseRequest = {
  ids: string[];
};

export class GetRecipesByIdsUsecase {
  constructor(private recipesRepo: RecipesRepo) {}

  async execute(request: GetRecipesByIdsUsecaseRequest): Promise<Recipe[]> {
    if (!Array.isArray(request.ids) || request.ids.length === 0) {
      throw new ValidationError(
        'GetRecipesByIdsUsecase: ids must be a non-empty array'
      );
    }

    const uniqueIds = Array.from(new Set(request.ids));

    uniqueIds.forEach((id) => {
      validateNonEmptyString(id, `GetRecipesByIdsUsecase id  ${id}`);
    });

    const recipes = await Promise.all(
      uniqueIds.map((id) => this.recipesRepo.getRecipeById(id))
    );

    // Filter out null values (recipes that weren't found)
    return recipes.filter((recipe): recipe is Recipe => recipe !== null);
  }
}
