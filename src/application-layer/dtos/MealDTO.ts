import { IngredientLineDTO } from './IngredientLineDTO';

export type MealDTO = {
  id: string;
  userId: string;
  name: string;
  ingredientLines: IngredientLineDTO[];
  createdAt: string;
  updatedAt: string;
};
