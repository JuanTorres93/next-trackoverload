import { CreateIngredientLineData, JSENDResponse, RecipeDTO } from "shared";

export class RecipeModule {
  constructor(private baseUrl: string) {}

  ////////// CREATE
  async createRecipe(
    userId: string,
    recipeName: string,
    ingredientLinesInfo: CreateIngredientLineData[],
    imageBuffer?: Buffer,
  ): Promise<JSENDResponse<RecipeDTO>> {
    const response = await fetch(`${this.baseUrl}/recipe`, {
      method: "POST",
      body: JSON.stringify({
        targetUserId: userId,
        name: recipeName,
        ingredientLinesInfo,
        imageBuffer,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const jsend = await response.json();

    return jsend;
  }

  async duplicateRecipe(
    recipeId: string,
    userId: string,
    newName?: string,
  ): Promise<JSENDResponse<RecipeDTO>> {
    const response = await fetch(
      `${this.baseUrl}/recipe/${recipeId}/duplicate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          newName,
        }),
      },
    );

    const jsend = await response.json();

    return jsend;
  }

  //////////// READ
  async getAllRecipesForUser(
    userId: string,
  ): Promise<JSENDResponse<RecipeDTO[]>> {
    const response = await fetch(`${this.baseUrl}/recipe/all/${userId}`);

    const jsend = await response.json();

    return jsend;
  }
  async getRecipeForUser(
    recipeId: string,
    userId: string,
  ): Promise<JSENDResponse<RecipeDTO>> {
    const response = await fetch(
      `${this.baseUrl}/recipe/${recipeId}/user/${userId}`,
    );

    const jsend = await response.json();

    return jsend;
  }

  ///////////// DELETE
  async deleteRecipe(
    recipeId: string,
    userId: string,
  ): Promise<JSENDResponse<null>> {
    const response = await fetch(`${this.baseUrl}/recipe/${recipeId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
      }),
    });

    const jsend = await response.json();

    return jsend;
  }

  async deleteIngredientFromRecipe(
    recipeId: string,
    ingredientId: string,
    userId: string,
  ): Promise<JSENDResponse<RecipeDTO>> {
    const response = await fetch(
      `${this.baseUrl}/recipe/${recipeId}/ingredient/${ingredientId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      },
    );

    const jsend = await response.json();

    return jsend;
  }
}
