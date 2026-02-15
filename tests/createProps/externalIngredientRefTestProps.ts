import {
  ExternalIngredientRef,
  ExternalIngredientRefCreateProps,
} from '@/domain/entities/externalingredientref/ExternalIngredientRef';
import { validIngredientProps } from './ingredientTestProps';

export const validExternalIngredientRefProps = {
  externalId: 'ext-ing-1',
  source: 'openfoodfacts',
  ingredientId: validIngredientProps.id,
  createdAt: new Date(),
};

export function createTestExternalIngredientRef(
  props?: Partial<ExternalIngredientRefCreateProps>,
) {
  return ExternalIngredientRef.create({
    externalId: props?.externalId || validExternalIngredientRefProps.externalId,
    source: props?.source || validExternalIngredientRefProps.source,
    ingredientId:
      props?.ingredientId || validExternalIngredientRefProps.ingredientId,
    createdAt: props?.createdAt || validExternalIngredientRefProps.createdAt,
  });
}
