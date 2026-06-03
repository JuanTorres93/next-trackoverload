import { CreateIngredientLineData, RecipeDTO, UserDTO } from "shared";

import "@/../tests/mocks/fetchWithCookies";

import { createUniqueUserProps } from "../../../../../tests/mocks/user";
import { TestApplicationBackendService } from "../TestApplicationBackendService";

describe("ApplicationBackendService", () => {
  let backendService: TestApplicationBackendService;
  let user: UserDTO;
  let baseRequest: {
    userId: string;
    recipeName: string;
    ingredientLinesInfo: CreateIngredientLineData[];
    imageBuffer?: Buffer;
  };

  beforeAll(async () => {
    backendService = new TestApplicationBackendService();

    const userTestProps = createUniqueUserProps();
    const userResponse = await backendService.createUser(
      userTestProps.name,
      userTestProps.plainPassword,
      userTestProps.email,
    );
    user = userResponse.data as UserDTO;

    await backendService.loginUser(
      userTestProps.email,
      userTestProps.plainPassword,
    );

    baseRequest = {
      userId: user.id,
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
  });

  describe("Recipes", () => {
    it("should create recipe", async () => {
      const newRecipeResponse = await backendService.createRecipe(
        baseRequest.userId,
        baseRequest.recipeName,
        baseRequest.ingredientLinesInfo,
        baseRequest.imageBuffer,
      );

      expect(newRecipeResponse.status).toBe("success");

      const createdRecipe = newRecipeResponse.data as RecipeDTO;

      expect(createdRecipe).toHaveProperty("id");
      expect(createdRecipe.name).toBe(baseRequest.recipeName);
    });

    it("should get all recipes for user", async () => {
      // create recipes
      const recipeNames = ["Recipe 1", "Recipe 2"];
      for (const name of recipeNames) {
        await backendService.createRecipe(
          baseRequest.userId,
          name,
          baseRequest.ingredientLinesInfo,
          baseRequest.imageBuffer,
        );
      }

      const allRecipesResponse = await backendService.getAllRecipesForUser(
        baseRequest.userId,
      );

      expect(allRecipesResponse.status).toBe("success");

      const recipes = allRecipesResponse.data as RecipeDTO[];

      expect(recipes.length).toBeGreaterThanOrEqual(recipeNames.length);
    });
  });
});
