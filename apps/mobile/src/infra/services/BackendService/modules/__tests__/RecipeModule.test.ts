import { CreateIngredientLineData, RecipeDTO, UserDTO } from "shared";

import "@/../tests/mocks/fetchWithCookies";

import { createUniqueUserProps } from "../../../../../../tests/mocks/user";
import { TestApplicationBackendService } from "../../TestApplicationBackendService";

describe("ApplicationBackendService - Recipes", () => {
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

    it("should duplicate an existing recipe", async () => {
      const name = "Original Recipe";

      const originalRecipeResponse = await backendService.createRecipe(
        baseRequest.userId,
        name,
        baseRequest.ingredientLinesInfo,
        baseRequest.imageBuffer,
      );

      const originalRecipeId = (originalRecipeResponse.data as RecipeDTO).id;

      const duplicatedRecipeResponse = await backendService.duplicateRecipe(
        originalRecipeId,
        baseRequest.userId,
      );

      expect(duplicatedRecipeResponse.status).toBe("success");
    });

    it("should delete an ingredient from a recipe", async () => {
      const recipeWithTwoIngredientsResponse =
        await backendService.createRecipe(
          baseRequest.userId,
          "Recipe with 2 Ingredients",
          [
            ...baseRequest.ingredientLinesInfo,
            {
              externalIngredientId: "456",
              source: "openfoodfacts",
              name: "Second Test Ingredient",
              caloriesPer100g: 100,
              proteinPer100g: 5,
              quantityInGrams: 50,
            },
          ],
          baseRequest.imageBuffer,
        );

      const recipe = recipeWithTwoIngredientsResponse.data as RecipeDTO;

      const ingredientToDelete = recipe.ingredientLines[0].ingredient;

      const deleteIngredientResponse =
        await backendService.deleteIngredientFromRecipe(
          recipe.id,
          ingredientToDelete.id,
          user.id,
        );

      expect(deleteIngredientResponse.status).toBe("success");
    });

    it("should get a recipe for a user", async () => {
      const recipeName = "Recipe to Get";

      const createdRecipeResponse = await backendService.createRecipe(
        baseRequest.userId,
        recipeName,
        baseRequest.ingredientLinesInfo,
        baseRequest.imageBuffer,
      );

      const createdRecipe = createdRecipeResponse.data as RecipeDTO;

      const getRecipeResponse = await backendService.getRecipeForUser(
        createdRecipe.id,
        baseRequest.userId,
      );

      expect(getRecipeResponse.status).toBe("success");
      const retrievedRecipe = getRecipeResponse.data as RecipeDTO;

      expect(retrievedRecipe.name).toBe(recipeName);
    });
  });
});
