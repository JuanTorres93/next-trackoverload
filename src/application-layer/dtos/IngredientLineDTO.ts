import { IngredientDTO } from './IngredientDTO';

export type IngredientLineDTO = {
  id: string;
  ingredient: IngredientDTO;
  quantityInGrams: number;
  createdAt: string;
  updatedAt: string;
};
