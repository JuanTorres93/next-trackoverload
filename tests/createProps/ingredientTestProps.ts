import {
  Ingredient,
  IngredientCreateProps,
} from '@/domain/entities/ingredient/Ingredient';

export const validIngredientProps = {
  id: 'ing1',
  name: 'Chicken Breast',
  calories: 100,
  protein: 15,
  imageUrl: 'https://example.com/image.jpg',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export function createTestIngredient(
  props?: Partial<IngredientCreateProps>,
): Ingredient {
  return Ingredient.create({
    id: props?.id || validIngredientProps.id,
    name: props?.name || validIngredientProps.name,
    calories: props?.calories || validIngredientProps.calories,
    protein: props?.protein || validIngredientProps.protein,
    imageUrl: props?.imageUrl || validIngredientProps.imageUrl,
    createdAt: props?.createdAt || validIngredientProps.createdAt,
    updatedAt: props?.updatedAt || validIngredientProps.updatedAt,
  });
}
