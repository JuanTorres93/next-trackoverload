import { IngredientLineDTO } from '@/application-layer/dtos/IngredientLineDTO';
import { IngredientFinderResult } from '@/domain/services/IngredientFinder.port';

export function createInMemoryRecipeIngredientLine(
  ingredientFinderResult: IngredientFinderResult
): {
  ingredientLine: IngredientLineDTO;
  ingredientExternalRef: IngredientFinderResult['externalRef'];
} {
  const fakeIngredient = {
    ...ingredientFinderResult.ingredient,
    id: `fake-id-${ingredientFinderResult.externalRef.externalId}`, // Fake id for client-side usage
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const externalRef = ingredientFinderResult.externalRef;

  const ingredientLine: IngredientLineDTO = {
    id: 'temp-id-' + externalRef.externalId,
    parentId: 'temp-parent-id',
    parentType: 'recipe',
    ingredient: fakeIngredient,
    quantityInGrams: 100,
    calories: Number(fakeIngredient.nutritionalInfoPer100g.calories) || 1,
    protein: Number(fakeIngredient.nutritionalInfoPer100g.protein) || 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return {
    ingredientLine,
    ingredientExternalRef: externalRef,
  };
}
