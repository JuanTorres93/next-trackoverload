import { Recipe } from '../entities/recipe/Recipe';

export interface RecipesRepo {
  getAllRecipes(): Promise<Recipe[]>;
  getAllRecipesByUserId(userId: string): Promise<Recipe[]>;
  getRecipeById(id: string): Promise<Recipe | null>;
  getRecipeByIdAndUserId(id: string, userId: string): Promise<Recipe | null>;
  saveRecipe(recipe: Recipe): Promise<void>;
  deleteRecipe(id: string): Promise<void>;
  deleteIngredientLineInRecipe(
    id: string,
    ingredientLineId: string
  ): Promise<void>;
  deleteMultipleIngredientLinesInRecipe(
    ids: string[],
    ingredientLineIds: string[]
  ): Promise<void>;
}
