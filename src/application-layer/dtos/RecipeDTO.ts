import { Recipe } from '@/domain/entities/recipe/Recipe';
import { IngredientLineDTO, toIngredientLineDTO } from './IngredientLineDTO';

export type RecipeDTO = {
  id: string;
  userId: string;
  name: string;
  ingredientLines: IngredientLineDTO[];
  calories: number;
  protein: number;
  createdAt: string;
  updatedAt: string;
};

export function toRecipeDTO(recipe: Recipe): RecipeDTO {
  return {
    id: recipe.id,
    userId: recipe.userId,
    name: recipe.name,
    ingredientLines: recipe.ingredientLines.map(toIngredientLineDTO),
    calories: recipe.calories,
    protein: recipe.protein,
    createdAt: recipe.createdAt.toISOString(),
    updatedAt: recipe.updatedAt.toISOString(),
  };
}
