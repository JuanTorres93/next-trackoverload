import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { IngredientDTO, toIngredientDTO } from './IngredientDTO';

export type IngredientLineDTO = {
  id: string;
  ingredient: IngredientDTO;
  quantityInGrams: number;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
};

export function toIngredientLineDTO(
  ingredientLine: IngredientLine
): IngredientLineDTO {
  return {
    id: ingredientLine.id,
    ingredient: toIngredientDTO(ingredientLine.ingredient),
    quantityInGrams: ingredientLine.quantityInGrams,
    createdAt: ingredientLine.createdAt.toISOString(),
    updatedAt: ingredientLine.updatedAt.toISOString(),
  };
}
