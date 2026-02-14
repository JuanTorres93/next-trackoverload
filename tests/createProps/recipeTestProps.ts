import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { validIngredientProps } from './ingredientTestProps';
import { userId } from './userTestProps';
import { Recipe, RecipeCreateProps } from '@/domain/entities/recipe/Recipe';

export const recipePropsNoIngredientLines = {
  id: 'recipe1',
  userId: userId,
  name: 'Test Recipe',
  imageUrl: 'http://example.com/recipe.jpg',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export function validRecipePropsWithIngredientLines(
  numLines = 2,
): RecipeCreateProps {
  const ingredientLine1 = IngredientLine.create({
    ...ingredientLineRecipePropsNoIngredient,
    id: 'line-1',
    ingredient: Ingredient.create(validIngredientProps),
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
  });

  let ingredientLines = [ingredientLine1, ingredientLine2];

  if (numLines === 1) {
    ingredientLines = [ingredientLine1];
  }

  return {
    ...recipePropsNoIngredientLines,
    ingredientLines,
  };
}

export function createTestRecipe(
  props?: Partial<RecipeCreateProps>,
  numIngredientLines: number = 1,
): Recipe {
  const validProps = validRecipePropsWithIngredientLines(numIngredientLines);

  return Recipe.create({
    id: props?.id || validProps.id,
    userId: props?.userId || validProps.userId,
    name: props?.name || validProps.name,
    ingredientLines: props?.ingredientLines || validProps.ingredientLines,
    createdAt: props?.createdAt || validProps.createdAt,
    updatedAt: props?.updatedAt || validProps.updatedAt,
    imageUrl: props?.imageUrl || validProps.imageUrl,
  });
}

export const ingredientLineRecipePropsNoIngredient = {
  id: 'line1',
  parentId: 'recipe1',
  parentType: 'recipe' as const,
  quantityInGrams: 200,
  createdAt: new Date(),
  updatedAt: new Date(),
};
