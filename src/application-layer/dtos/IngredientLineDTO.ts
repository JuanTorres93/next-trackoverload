import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import {
  fromIngredientDTO,
  IngredientDTO,
  toIngredientDTO,
} from './IngredientDTO';

export type IngredientLineDTO = {
  id: string;
  recipeId: string;
  ingredient: IngredientDTO;
  quantityInGrams: number;
  calories: number;
  protein: number;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
};

export function toIngredientLineDTO(
  ingredientLine: IngredientLine
): IngredientLineDTO {
  return {
    id: ingredientLine.id,
    recipeId: ingredientLine.recipeId,
    ingredient: toIngredientDTO(ingredientLine.ingredient),
    quantityInGrams: ingredientLine.quantityInGrams,
    calories: ingredientLine.calories,
    protein: ingredientLine.protein,
    createdAt: ingredientLine.createdAt.toISOString(),
    updatedAt: ingredientLine.updatedAt.toISOString(),
  };
}

export function fromIngredientLineDTO(dto: IngredientLineDTO): IngredientLine {
  return IngredientLine.create({
    id: dto.id,
    recipeId: dto.recipeId,
    ingredient: fromIngredientDTO(dto.ingredient),
    quantityInGrams: dto.quantityInGrams,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  });
}
