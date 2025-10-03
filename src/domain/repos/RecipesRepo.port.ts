import { Recipe } from '../recipe/Recipe';

export interface RecipesRepo {
  getAllRecipes(): Promise<Recipe[]>;
  getRecipeById(id: string): Promise<Recipe | null>;
  saveRecipe(recipe: Recipe): Promise<void>;
  deleteRecipe(id: string): Promise<void>;
}
