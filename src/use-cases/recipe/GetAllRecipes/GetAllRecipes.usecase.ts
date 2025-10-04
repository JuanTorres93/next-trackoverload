import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { Recipe } from '@/domain/entities/recipe/Recipe';

export class GetAllRecipesUsecase {
  constructor(private recipesRepo: RecipesRepo) {}

  async execute(): Promise<Recipe[]> {
    const recipes = await this.recipesRepo.getAllRecipes();

    return recipes || [];
  }
}
