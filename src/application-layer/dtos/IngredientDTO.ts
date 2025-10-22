import { Ingredient } from '@/domain/entities/ingredient/Ingredient';

export type IngredientDTO = {
  id: string;
  name: string;
  nutritionalInfoPer100g: {
    calories: number;
    protein: number;
  };
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
};

export function toIngredientDTO(ingredient: Ingredient): IngredientDTO {
  return {
    id: ingredient.id,
    name: ingredient.name,
    nutritionalInfoPer100g: {
      calories: ingredient.nutritionalInfoPer100g.calories,
      protein: ingredient.nutritionalInfoPer100g.protein,
    },
    createdAt: ingredient.createdAt.toISOString(),
    updatedAt: ingredient.updatedAt.toISOString(),
  };
}
