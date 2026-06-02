import { MealDTO } from "shared";

import { Meal } from "../../domain/entities/meal/Meal";
import {
  fromIngredientLineDTO,
  toIngredientLineDTO,
} from "./IngredientLineDTO";

export function toMealDTO(meal: Meal): MealDTO {
  return {
    id: meal.id,
    userId: meal.userId,
    name: meal.name,
    ingredientLines: meal.ingredientLines.map(toIngredientLineDTO),
    calories: meal.calories,
    protein: meal.protein,
    createdFromRecipeId: meal.createdFromRecipeId,
    imageUrl: meal.imageUrl,
    isEaten: meal.isEaten,
    createdAt: meal.createdAt.toISOString(),
    updatedAt: meal.updatedAt.toISOString(),
  };
}

export function fromMealDTO(dto: MealDTO): Meal {
  return Meal.create({
    id: dto.id,
    userId: dto.userId,
    name: dto.name,
    ingredientLines: dto.ingredientLines.map(fromIngredientLineDTO),
    createdFromRecipeId: dto.createdFromRecipeId,
    imageUrl: dto.imageUrl,
    isEaten: dto.isEaten,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  });
}
