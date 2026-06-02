import { IngredientDTO } from "./IngredientDTO";

export type IngredientLineDTO = {
  id: string;

  parentId: string;
  parentType: "meal" | "recipe";

  ingredient: IngredientDTO;

  quantityInGrams: number;
  calories: number;
  protein: number;

  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
};
