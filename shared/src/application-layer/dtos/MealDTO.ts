import { IngredientLineDTO } from "./IngredientLineDTO";

export type MealDTO = {
  id: string;
  userId: string;

  name: string;

  ingredientLines: IngredientLineDTO[];
  calories: number;
  protein: number;
  isEaten?: boolean;

  createdFromRecipeId: string;

  imageUrl?: string;

  createdAt: string;
  updatedAt: string;
};
