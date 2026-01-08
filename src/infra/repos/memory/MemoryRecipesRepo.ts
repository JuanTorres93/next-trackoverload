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

  async getAllRecipesByUserId(userId: string): Promise<Recipe[]> {
    return this.recipes.filter((recipe) => recipe.userId === userId);
  }

  async getRecipeById(id: string): Promise<Recipe | null> {
    const recipe = this.recipes.find((rec) => rec.id === id);
    return recipe || null;
  }

  async getRecipeByIdAndUserId(
    id: string,
    userId: string
  ): Promise<Recipe | null> {
    const recipe = this.recipes.find(
      (rec) => rec.id === id && rec.userId === userId
    );
    return recipe || null;
  }

  async deleteRecipe(id: string): Promise<void> {
    const index = this.recipes.findIndex((rec) => rec.id === id);
    // NOTE: Throw error in use case in order not to have false positives in tests
    if (index === -1) return Promise.reject(null);

    this.recipes.splice(index, 1);
  }

  async deleteIngredientLineInRecipe(
    id: string,
    ingredientLineId: string
  ): Promise<void> {
    const recipe = this.recipes.find((rec) => rec.id === id);
    if (!recipe) return Promise.reject(null);

    recipe.removeIngredientLineByIngredientId(ingredientLineId);
  }

  async deleteMultipleIngredientLinesInRecipe(
    ids: string[],
    ingredientLineIds: string[]
  ): Promise<void> {
    for (const id of ids) {
      const recipe = this.recipes.find((rec) => rec.id === id);
      if (!recipe) continue;

      for (const ingredientLineId of ingredientLineIds) {
        recipe.removeIngredientLineByIngredientId(ingredientLineId);
      }
    }
  }

  async deleteAllRecipesForUser(userId: string): Promise<void> {
    this.recipes = this.recipes.filter((r) => r.userId !== userId);
  }

  // IMPORTANT NOTE: Helper method for testing - not part of the interface
  clearForTesting(): void {
    this.recipes = [];
  }

  // IMPORTANT NOTE: Helper method for testing - not part of the interface
  countForTesting(): number {
    return this.recipes.length;
  }

  // IMPORTANT NOTE: Helper method for testing - not part of the interface
  getAllForTesting(): Recipe[] {
    return [...this.recipes];
  }
}
