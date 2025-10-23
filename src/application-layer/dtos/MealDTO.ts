import { Meal } from '@/domain/entities/meal/Meal';
import { IngredientLineDTO, toIngredientLineDTO } from './IngredientLineDTO';

export type MealDTO = {
  id: string;
  userId: string;
  name: string;
  ingredientLines: IngredientLineDTO[];
  calories: number;
  protein: number;
  createdAt: string;
  updatedAt: string;
};

export function toMealDTO(meal: Meal): MealDTO {
  return {
    id: meal.id,
    userId: meal.userId,
    name: meal.name,
    ingredientLines: meal.ingredientLines.map(toIngredientLineDTO),
    calories: meal.calories,
    protein: meal.protein,
    createdAt: meal.createdAt.toISOString(),
    updatedAt: meal.updatedAt.toISOString(),
  };
}
