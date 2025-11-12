import { IngredientDTO } from '@/application-layer/dtos/IngredientDTO';
import { IngredientLineDTO } from '@/application-layer/dtos/IngredientLineDTO';

export function createInMemoryIngredientLine(ingredient: IngredientDTO) {
  const ingredientLine: IngredientLineDTO = {
    id: 'temp-id-' + ingredient.id,
    ingredient: ingredient,
    quantityInGrams: 100,
    calories: Number(ingredient.nutritionalInfoPer100g.calories) || 1,
    protein: Number(ingredient.nutritionalInfoPer100g.protein) || 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return ingredientLine;
}
