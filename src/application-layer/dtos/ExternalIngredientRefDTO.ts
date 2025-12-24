import { ExternalIngredientRef } from '@/domain/entities/externalingredientref/ExternalIngredientRef';

export type ExternalIngredientRefDTO = {
  externalId: string;
  source: string;
  ingredientId: string;
  createdAt: string; // ISO 8601
};

export function toExternalIngredientRefDTO(
  externalIngredientRef: ExternalIngredientRef
): ExternalIngredientRefDTO {
  return {
    externalId: externalIngredientRef.externalId,
    source: externalIngredientRef.source,
    ingredientId: externalIngredientRef.ingredientId,
    createdAt: externalIngredientRef.createdAt.toISOString(),
  };
}

export function fromExternalIngredientRefDTO(
  dto: ExternalIngredientRefDTO
): ExternalIngredientRef {
  return ExternalIngredientRef.create({
    externalId: dto.externalId,
    source: dto.source,
    ingredientId: dto.ingredientId,
    createdAt: new Date(dto.createdAt),
  });
}
