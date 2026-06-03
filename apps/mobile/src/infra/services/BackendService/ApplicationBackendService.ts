import {
  CreateIngredientLineData,
  ExerciseFinderResult,
  JSENDResponse,
  RecipeDTO,
  UserDTO,
} from "shared";

import { BackendService } from "@/application-layer/services/BackendService.port";

export class ApplicationBackendService implements BackendService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    if (baseUrl.endsWith("/")) {
      baseUrl = baseUrl.slice(0, -1);
    }

    this.baseUrl = baseUrl;
  }

  /////////////// EXERCISES
  async getExerciseByFuzzyName(
    name: string,
  ): Promise<JSENDResponse<ExerciseFinderResult[]>> {
    const response = await fetch(`${this.baseUrl}/exercise/fuzzy/${name}`);

    const jsend = await response.json();

    return jsend;
  }

  /////////////// AUTH
  async createUser(
    name: string,
    plainPassword: string,
    email: string,
  ): Promise<JSENDResponse<UserDTO>> {
    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, plainPassword, email }),
    });

    const jsend = await response.json();

    return jsend;
  }
  async loginUser(
    email: string,
    plainPassword: string,
  ): Promise<JSENDResponse<string>> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, plainPassword }),
    });

    const jsend = await response.json();

    return jsend;
  }
  async logoutUser(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const jsend = await response.json();

    return jsend.message;
  }

  /////////////// RECIPES
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

  async getAllRecipesForUser(
    userId: string,
  ): Promise<JSENDResponse<RecipeDTO[]>> {
    const response = await fetch(`${this.baseUrl}/recipe/all/${userId}`);

    const jsend = await response.json();

    return jsend;
  }
}
