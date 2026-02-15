import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { validIngredientProps } from './ingredientTestProps';
import {
  recipePropsNoIngredientLines,
  ingredientLineRecipePropsNoIngredient,
} from './recipeTestProps';
import { userId } from './userTestProps';
import { Meal, MealCreateProps } from '@/domain/entities/meal/Meal';

const mealId = 'meal1';

export const mealPropsNoIngredientLines = {
  id: mealId,
  userId: userId,
  name: 'Chicken Meal',
  createdFromRecipeId: recipePropsNoIngredientLines.id,
  imageUrl: 'http://example.com/meal.jpg',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export function validMealWithIngredientLines() {
  const ingredientLine1 = IngredientLine.create({
    ...ingredientLineRecipePropsNoIngredient,
    id: 'line-1',
    parentType: 'meal',
    parentId: mealId,
    ingredient: Ingredient.create(validIngredientProps),
    quantityInGrams: 150,
  });

  return {
    ...mealPropsNoIngredientLines,
    ingredientLines: [ingredientLine1],
  };
}

export function createTestMeal(props?: Partial<MealCreateProps>): Meal {
  const validProps = validMealWithIngredientLines();

  return Meal.create({
    id: props?.id || validProps.id,
    userId: props?.userId || validProps.userId,
    name: props?.name || validProps.name,
    imageUrl: props?.imageUrl || validProps.imageUrl,
    createdFromRecipeId:
      props?.createdFromRecipeId || validProps.createdFromRecipeId,
    ingredientLines: props?.ingredientLines || validProps.ingredientLines,
    createdAt: props?.createdAt || validProps.createdAt,
    updatedAt: props?.updatedAt || validProps.updatedAt,
  });
}
