import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { Id } from '@/domain/value-objects/Id/Id';

export type IngredientDTO = {
  id: string;
  name: string;
  nutritionalInfoPer100g: {
    calories: number;
    protein: number;
  };
  imageUrl?: string;
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
    imageUrl: ingredient.imageUrl,
    createdAt: ingredient.createdAt.toISOString(),
    updatedAt: ingredient.updatedAt.toISOString(),
  };
}

export function fromIngredientDTO(dto: IngredientDTO): Ingredient {
  return Ingredient.create({
    id: Id.create(dto.id),
    name: dto.name,
    nutritionalInfoPer100g: {
      calories: dto.nutritionalInfoPer100g.calories,
      protein: dto.nutritionalInfoPer100g.protein,
    },
    imageUrl: dto.imageUrl,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  });
}
