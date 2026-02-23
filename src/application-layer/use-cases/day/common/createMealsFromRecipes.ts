import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Meal } from '@/domain/entities/meal/Meal';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { IdGenerator } from '@/domain/services/IdGenerator.port';

export function createMealsFromRecipes(
  recipes: Recipe[],
  userId: string,
  idGenerator: IdGenerator,
): Meal[] {
  return recipes.map((recipe) => {
    const newMealId = idGenerator.generateId();

    const mealIngredientLines = recipe.ingredientLines.map((line) =>
      IngredientLine.create({
        id: idGenerator.generateId(),
        parentId: newMealId,
        parentType: 'meal',
        ingredient: line.ingredient,
        quantityInGrams: line.quantityInGrams,
      }),
    );

    return Meal.create({
      id: newMealId,
      userId,
      name: recipe.name,
      createdFromRecipeId: recipe.id,
      ingredientLines: mealIngredientLines,
      imageUrl: recipe.imageUrl,
    });
  });
}
