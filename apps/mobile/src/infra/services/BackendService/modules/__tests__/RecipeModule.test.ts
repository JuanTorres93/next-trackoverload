import { RecipeDTO, UserDTO } from "shared";

import "@/../tests/mocks/fetchWithCookies";

import { createRecipeInTestBackend } from "../../../../../../tests/mocks/recipe";
import { createUniqueUserProps } from "../../../../../../tests/mocks/user";
import { TestApplicationBackendService } from "../../TestApplicationBackendService";

describe("ApplicationBackendService - Recipes", () => {
  let backendService: TestApplicationBackendService;
  let user: UserDTO;

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
  });

  describe("Recipes", () => {
    it("should create recipe", async () => {
      const request = {
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

      const newRecipeResponse = await backendService.createRecipe(
        request.userId,
        request.recipeName,
        request.ingredientLinesInfo,
        request.imageBuffer,
      );

      expect(newRecipeResponse.status).toBe("success");

      const createdRecipe = newRecipeResponse.data as RecipeDTO;

      expect(createdRecipe).toHaveProperty("id");
      expect(createdRecipe.name).toBe(request.recipeName);
    });

    it("should add ingredient to existing recipe", async () => {
      const { recipe } = await createRecipeInTestBackend(
        backendService,
        user.id,
      );

      const newIngredient = {
        externalIngredientId: "456",
        source: "openfoodfacts",
        name: "New Ingredient to be added",
        caloriesPer100g: 100,
        proteinPer100g: 5,
        quantityInGrams: 50,
      };

      const addIngredientResponse = await backendService.addIngredientToRecipe(
        recipe.id,
        user.id,
        newIngredient,
      );

      expect(addIngredientResponse.status).toBe("success");

      const updatedRecipe = addIngredientResponse.data as RecipeDTO;

      const addedIngredientLine = updatedRecipe.ingredientLines.find(
        (line) => line.ingredient.name === newIngredient.name,
      );

      expect(addedIngredientLine).not.toBeUndefined();
    });

    it("should get all recipes for user", async () => {
      const recipeNames = ["Recipe 1", "Recipe 2"];

      for (const name of recipeNames) {
        await createRecipeInTestBackend(backendService, user.id, {
          recipeName: name,
        });
      }

      const allRecipesResponse = await backendService.getAllRecipesForUser(
        user.id,
      );

      expect(allRecipesResponse.status).toBe("success");

      const recipes = allRecipesResponse.data as RecipeDTO[];

      expect(recipes.length).toBeGreaterThanOrEqual(recipeNames.length);
    });

    it("should duplicate an existing recipe", async () => {
      const name = "Original Recipe";

      const { recipe: originalRecipe } = await createRecipeInTestBackend(
        backendService,
        user.id,
        {
          recipeName: name,
        },
      );

      const originalRecipeId = originalRecipe.id;

      const duplicatedRecipeResponse = await backendService.duplicateRecipe(
        originalRecipeId,
        user.id,
      );

      expect(duplicatedRecipeResponse.status).toBe("success");
    });

    it("should delete an ingredient from a recipe", async () => {
      const { recipe } = await createRecipeInTestBackend(
        backendService,
        user.id,
        {
          recipeName: "Recipe with 2 Ingredients",
          ingredientLinesInfo: [
            {
              externalIngredientId: "456",
              source: "openfoodfacts",
              name: "Test Ingredient",
              caloriesPer100g: 100,
              proteinPer100g: 5,
              quantityInGrams: 50,
            },
            {
              externalIngredientId: "789",
              source: "openfoodfacts",
              name: "Another Test Ingredient",
              caloriesPer100g: 150,
              proteinPer100g: 7.5,
              quantityInGrams: 50,
            },
          ],
        },
      );

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

      const { recipe: createdRecipe } = await createRecipeInTestBackend(
        backendService,
        user.id,
        {
          recipeName,
        },
      );

      const getRecipeResponse = await backendService.getRecipeForUser(
        createdRecipe.id,
        user.id,
      );

      expect(getRecipeResponse.status).toBe("success");
      const retrievedRecipe = getRecipeResponse.data as RecipeDTO;

      expect(retrievedRecipe.name).toBe(recipeName);
    });

    it("should delete recipe", async () => {
      const { recipe: createdRecipe } = await createRecipeInTestBackend(
        backendService,
        user.id,
      );

      const deleteResponse = await backendService.deleteRecipe(
        createdRecipe.id,
        user.id,
      );

      expect(deleteResponse.status).toBe("success");
    });

    it("should update recipe name", async () => {
      const { recipe: createdRecipe } = await createRecipeInTestBackend(
        backendService,
        user.id,
        {
          recipeName: "Recipe to Update",
        },
      );

      const newName = "Updated Recipe Name";

      const updateResponse = await backendService.updateRecipeName(
        createdRecipe.id,
        user.id,
        newName,
      );

      expect(updateResponse.status).toBe("success");

      const updatedRecipe = updateResponse.data as RecipeDTO;

      expect(updatedRecipe.name).toBe(newName);
    });

    it("should update recipe image", async () => {
      const { recipe: createdRecipe } = await createRecipeInTestBackend(
        backendService,
        user.id,
      );

      const pngBuffer = Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jK3sAAAAASUVORK5CYII=",
        "base64",
      );

      const updateResponse = await backendService.updateRecipeImage(
        createdRecipe.id,
        user.id,
        pngBuffer,
      );

      expect(updateResponse.status).toBe("success");

      const updatedRecipe = updateResponse.data as RecipeDTO;

      expect(updatedRecipe.imageUrl).not.toBeUndefined();
    });
  });
});
