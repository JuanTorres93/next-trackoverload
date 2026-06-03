import { CreateIngredientLineData, RecipeDTO } from "shared";

import { TestApplicationBackendService } from "@/infra/services/BackendService/TestApplicationBackendService";

export async function createRecipeInTestBackend(
  backendService: TestApplicationBackendService,
  userId: string,
  overrides?: Partial<{
    recipeName: string;
    ingredientLinesInfo: CreateIngredientLineData[];
    imageBuffer?: Buffer;
  }>,
) {
  const request = {
    ...baseRequest,
    userId,
    ...overrides,
  };

  const response = await backendService.createRecipe(
    request.userId,
    request.recipeName,
    request.ingredientLinesInfo,
    request.imageBuffer,
  );

  const recipe = response.data as RecipeDTO;

  return {
    recipe,
  };
}

const baseRequest = {
  recipeName: "Test Recipe",
  ingredientLinesInfo: [
    {
      externalIngredientId: "123",
      source: "openfoodfacts",
      name: "Test Ingredient",
      caloriesPer100g: 200,
      proteinPer100g: 10,
      quantityInGrams: 150,
    },
  ],
  imageBuffer: undefined,
};
