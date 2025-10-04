import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { validateNonEmptyString } from '@/domain/common/validation';

export type GetRecipeByIdUsecaseRequest = {
  id: string;
};

export class GetRecipeByIdUsecase {
  constructor(private recipesRepo: RecipesRepo) {}

  async execute(request: GetRecipeByIdUsecaseRequest): Promise<Recipe | null> {
    validateNonEmptyString(request.id, 'GetRecipeByIdUsecase');

    const recipe = await this.recipesRepo.getRecipeById(request.id);
    return recipe || null;
  }
}
