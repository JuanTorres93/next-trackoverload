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

  async getExerciseByFuzzyName(
    name: string,
  ): Promise<JSENDResponse<ExerciseFinderResult[]>> {
    const response = await fetch(`${this.baseUrl}/exercise/fuzzy/${name}`);

    const jsend = await response.json();

    return jsend;
  }

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

  async createRecipe(
    userId: string,
    recipeName: string,
    ingredientLinesInfo: CreateIngredientLineData[],
    imageBuffer?: Buffer,
  ): Promise<JSENDResponse<RecipeDTO>> {
    const response = await fetch(`${this.baseUrl}/recipe`, {
      method: "POST",
      body: JSON.stringify({
        userId,
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
}
