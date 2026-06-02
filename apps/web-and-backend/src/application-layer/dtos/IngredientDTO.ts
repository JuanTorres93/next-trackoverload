import { IngredientDTO } from "shared";

import { Ingredient } from "../../domain/entities/ingredient/Ingredient";

export function toIngredientDTO(ingredient: Ingredient): IngredientDTO {
  return {
    id: ingredient.id,
    name: ingredient.name,

    nutritionalInfoPer100g: {
      calories: ingredient.nutritionalInfoPer100g.calories,
      protein: ingredient.nutritionalInfoPer100g.protein,
    },

    imageUrl: ingredient.imageUrl,

    category: ingredient.category,

    createdAt: ingredient.createdAt.toISOString(),
    updatedAt: ingredient.updatedAt.toISOString(),
  };
}

export function fromIngredientDTO(dto: IngredientDTO): Ingredient {
  return Ingredient.create({
    id: dto.id,
    name: dto.name,

    calories: dto.nutritionalInfoPer100g.calories,
    protein: dto.nutritionalInfoPer100g.protein,

    imageUrl: dto.imageUrl,

    category: dto.category,

    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  });
}
