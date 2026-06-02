import { IngredientLineDTO } from "shared";

import { IngredientLine } from "../../domain/entities/ingredientline/IngredientLine";
import { fromIngredientDTO, toIngredientDTO } from "./IngredientDTO";

export function toIngredientLineDTO(
  ingredientLine: IngredientLine,
): IngredientLineDTO {
  return {
    id: ingredientLine.id,
    parentId: ingredientLine.parentId,
    parentType: ingredientLine.parentType,
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
    parentId: dto.parentId,
    parentType: dto.parentType,
    ingredient: fromIngredientDTO(dto.ingredient),
    quantityInGrams: dto.quantityInGrams,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  });
}
