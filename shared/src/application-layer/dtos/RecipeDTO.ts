import { IngredientLineDTO } from "./IngredientLineDTO";

export type RecipeDTO = {
  id: string;
  userId: string;

  name: string;

  imageUrl?: string;

  ingredientLines: IngredientLineDTO[];
  calories: number;
  protein: number;

  createdAt: string;
  updatedAt: string;
};
