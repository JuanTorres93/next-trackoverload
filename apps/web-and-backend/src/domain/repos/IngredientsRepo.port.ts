import { Ingredient } from '../entities/ingredient/Ingredient';

export interface IngredientsRepo {
  getAllIngredients(): Promise<Ingredient[]>;
  getIngredientById(id: string): Promise<Ingredient | null>;
  getIngredientsByIds(ids: string[]): Promise<Ingredient[]>;
  saveIngredient(ingredient: Ingredient): Promise<void>;
  deleteIngredient(id: string): Promise<void>;
}
