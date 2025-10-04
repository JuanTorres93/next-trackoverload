import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { Recipe } from '@/domain/entities/recipe/Recipe';

export class MemoryRecipesRepo implements RecipesRepo {
  private recipes: Recipe[] = [];

  async saveRecipe(recipe: Recipe): Promise<void> {
    const existingIndex = this.recipes.findIndex((rec) => rec.id === recipe.id);

    if (existingIndex !== -1) {
      this.recipes[existingIndex] = recipe;
    } else {
      this.recipes.push(recipe);
    }
  }

  async getAllRecipes(): Promise<Recipe[]> {
    return [...this.recipes];
  }

  async getRecipeById(id: string): Promise<Recipe | null> {
    const recipe = this.recipes.find((rec) => rec.id === id);
    return recipe || null;
  }

  async deleteRecipe(id: string): Promise<void> {
    const index = this.recipes.findIndex((rec) => rec.id === id);
    // NOTE: Throw error in use case in order not to have false positives in tests
    if (index === -1) return Promise.reject(null);

    this.recipes.splice(index, 1);
  }
}
