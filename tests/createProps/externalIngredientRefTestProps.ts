import { validIngredientProps } from './ingredientTestProps';

export const validExternalIngredientRefProps = {
  externalId: 'ext-ing-1',
  source: 'openfoodfacts',
  ingredientId: validIngredientProps.id,
  createdAt: new Date(),
};
