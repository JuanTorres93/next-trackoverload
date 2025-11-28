import { IngredientLine } from '../entities/ingredientline/IngredientLine';

export interface IngredientLinesRepo {
  getAllIngredientLines(): Promise<IngredientLine[]>;
  getIngredientLineById(id: string): Promise<IngredientLine | null>;
  getIngredientLinesByIds(ids: string[]): Promise<IngredientLine[]>;
  saveIngredientLine(ingredientLine: IngredientLine): Promise<void>;
  saveMultipleIngredientLines(ingredientLines: IngredientLine[]): Promise<void>;
  deleteIngredientLine(id: string): Promise<void>;
  deleteMultipleIngredientLines(ids: string[]): Promise<void>;
}
