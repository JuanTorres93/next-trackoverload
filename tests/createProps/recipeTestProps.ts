import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { validIngredientProps } from './ingredientTestProps';
import { userId } from './userTestProps';

export const recipePropsNoIngredientLines = {
  id: 'recipe1',
  userId: userId,
  name: 'Test Recipe',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export function validRecipePropsWithIngredientLines() {
  const ingredientLine1 = IngredientLine.create({
    ...ingredientLineRecipePropsNoIngredient,
    id: 'line-1',
    ingredient: Ingredient.create(validIngredientProps),
    quantityInGrams: 100,
  });

  const ingredientLine2 = IngredientLine.create({
    ...ingredientLineRecipePropsNoIngredient,
    id: 'line-2',
    ingredient: Ingredient.create({
      id: 'ing2',
      name: 'Rice',
      calories: 130,
      protein: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    quantityInGrams: 200,
  });

  return {
    ...recipePropsNoIngredientLines,
    ingredientLines: [ingredientLine1, ingredientLine2],
  };
}

export const ingredientLineRecipePropsNoIngredient = {
  id: 'line1',
  parentId: 'recipe1',
  parentType: 'recipe' as const,
  quantityInGrams: 200,
  createdAt: new Date(),
  updatedAt: new Date(),
};
