import { IngredientDTO } from './IngredientDTO';

export type IngredientLineDTO = {
  id: string;
  ingredient: IngredientDTO;
  quantityInGrams: number;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
};
