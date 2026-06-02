import { RecipeDTO } from "shared";

import { Recipe } from "../../domain/entities/recipe/Recipe";
import {
  fromIngredientLineDTO,
  toIngredientLineDTO,
} from "./IngredientLineDTO";

export function toRecipeDTO(recipe: Recipe): RecipeDTO {
  return {
    id: recipe.id,
    userId: recipe.userId,
    name: recipe.name,
    imageUrl: recipe.imageUrl,
    ingredientLines: recipe.ingredientLines.map(toIngredientLineDTO),
    calories: recipe.calories,
    protein: recipe.protein,
    createdAt: recipe.createdAt.toISOString(),
    updatedAt: recipe.updatedAt.toISOString(),
  };
}

export function fromRecipeDTO(dto: RecipeDTO): Recipe {
  return Recipe.create({
    id: dto.id,
    userId: dto.userId,
    name: dto.name,
    imageUrl: dto.imageUrl,
    ingredientLines: dto.ingredientLines.map(fromIngredientLineDTO),
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  });
}
