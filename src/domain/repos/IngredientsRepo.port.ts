import { Ingredient } from '../ingredient/Ingredient';

export interface IngredientsRepo {
  getAllIngredients(): Promise<Ingredient[]>;
  getIngredientById(id: string): Promise<Ingredient | null>;
  saveIngredient(ingredient: Ingredient): Promise<void>;
  deleteIngredient(id: string): Promise<void>;
}
