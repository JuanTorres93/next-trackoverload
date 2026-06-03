import {
  CreateIngredientLineData,
  ExerciseFinderResult,
  JSENDResponse,
  RecipeDTO,
  UserDTO,
} from "shared";

import { BackendService } from "@/application-layer/services/BackendService.port";

import { AuthModule } from "./modules/AuthModule";
import { ExerciseModule } from "./modules/ExerciseModule";
import { RecipeModule } from "./modules/RecipeModule";

export class ApplicationBackendService implements BackendService {
  private baseUrl: string;

  private recipeModule: RecipeModule;
  private authModule: AuthModule;
  private exerciseModule: ExerciseModule;

  constructor(baseUrl: string) {
    if (baseUrl.endsWith("/")) {
      baseUrl = baseUrl.slice(0, -1);
    }

    this.baseUrl = baseUrl;
    this.recipeModule = new RecipeModule(this.baseUrl);
    this.authModule = new AuthModule(this.baseUrl);
    this.exerciseModule = new ExerciseModule(this.baseUrl);
  }

  /////////////// EXERCISES
  async getExerciseByFuzzyName(
    name: string,
  ): Promise<JSENDResponse<ExerciseFinderResult[]>> {
    return this.exerciseModule.getExerciseByFuzzyName(name);
  }

  /////////////// AUTH
  async createUser(
    name: string,
    plainPassword: string,
    email: string,
  ): Promise<JSENDResponse<UserDTO>> {
    return this.authModule.createUser(name, plainPassword, email);
  }
  async loginUser(
    email: string,
    plainPassword: string,
  ): Promise<JSENDResponse<string>> {
    return this.authModule.loginUser(email, plainPassword);
  }
  async logoutUser(): Promise<string> {
    return this.authModule.logoutUser();
  }

  /////////////// RECIPES
  async createRecipe(
    userId: string,
    recipeName: string,
    ingredientLinesInfo: CreateIngredientLineData[],
    imageBuffer?: Buffer,
  ): Promise<JSENDResponse<RecipeDTO>> {
    return this.recipeModule.createRecipe(
      userId,
      recipeName,
      ingredientLinesInfo,
      imageBuffer,
    );
  }

  async duplicateRecipe(
    recipeId: string,
    userId: string,
    newName?: string,
  ): Promise<JSENDResponse<RecipeDTO>> {
    return this.recipeModule.duplicateRecipe(recipeId, userId, newName);
  }

  async getAllRecipesForUser(
    userId: string,
  ): Promise<JSENDResponse<RecipeDTO[]>> {
    return this.recipeModule.getAllRecipesForUser(userId);
  }
  async getRecipeForUser(
    recipeId: string,
    userId: string,
  ): Promise<JSENDResponse<RecipeDTO>> {
    return this.recipeModule.getRecipeForUser(recipeId, userId);
  }

  async deleteIngredientFromRecipe(
    recipeId: string,
    ingredientId: string,
    userId: string,
  ): Promise<JSENDResponse<RecipeDTO>> {
    return this.recipeModule.deleteIngredientFromRecipe(
      recipeId,
      ingredientId,
      userId,
    );
  }
}
