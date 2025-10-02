import { Ingredient, IngredientUpdateProps } from '../ingredient/Ingredient';

export interface IngredientsService {
  getAllIngredients(): Promise<Ingredient[]>;
  getIngredientById(id: string): Promise<Ingredient | null>;
  saveIngredient(ingredient: Ingredient): Promise<void>;
  deleteIngredient(id: string): Promise<void>;
  updateIngredient(
    ingredient: Ingredient,
    patch: IngredientUpdateProps
  ): Promise<Ingredient>;
}
