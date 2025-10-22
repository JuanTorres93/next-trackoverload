import { IngredientLineDTO } from './IngredientLineDTO';

export type RecipeDTO = {
  id: string;
  userId: string;
  name: string;
  ingredientLines: IngredientLineDTO[];
  createdAt: string;
  updatedAt: string;
};
