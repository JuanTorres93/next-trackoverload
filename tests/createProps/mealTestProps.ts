import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { validIngredientProps } from './ingredientTestProps';
import {
  recipePropsNoIngredientLines,
  ingredientLineRecipePropsNoIngredient,
} from './recipeTestProps';
import { userId } from './userTestProps';

export const mealPropsNoIngredientLines = {
  id: 'meal1',
  userId: userId,
  name: 'Chicken Meal',
  createdFromRecipeId: recipePropsNoIngredientLines.id,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export function validMealWithIngredientLines() {
  const ingredientLine1 = IngredientLine.create({
    ...ingredientLineRecipePropsNoIngredient,
    id: 'line-1',
    ingredient: Ingredient.create(validIngredientProps),
    quantityInGrams: 150,
  });

  return {
    ...mealPropsNoIngredientLines,
    ingredientLines: [ingredientLine1],
  };
}
