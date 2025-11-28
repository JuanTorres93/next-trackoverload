import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Id } from '@/domain/value-objects/Id/Id';
import {
  IngredientDTO,
  toIngredientDTO,
  fromIngredientDTO,
} from './IngredientDTO';

export type IngredientLineDTO = {
  id: string;
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
    id: Id.create(dto.id),
    ingredient: fromIngredientDTO(dto.ingredient),
    quantityInGrams: dto.quantityInGrams,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  });
}
