import { IngredientLine } from '../entities/ingredient/IngredientLine';

export interface IngredientLinesRepo {
  getAllIngredientLines(): Promise<IngredientLine[]>;
  getIngredientLineById(id: string): Promise<IngredientLine | null>;
  getIngredientLinesByIds(ids: string[]): Promise<IngredientLine[]>;
  // TODO: add getIngredientLinesByRecipeId ?
  saveIngredientLine(ingredientLine: IngredientLine): Promise<void>;
  deleteIngredientLine(id: string): Promise<void>;
}
