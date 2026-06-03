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
import { MealModule } from "./modules/MealModule";
import { RecipeModule } from "./modules/RecipeModule";

export class ApplicationBackendService implements BackendService {
  private baseUrl: string;

  private authModule: AuthModule;
  private recipeModule: RecipeModule;
  private mealModule: MealModule;
  private exerciseModule: ExerciseModule;

  constructor(baseUrl: string) {
    if (baseUrl.endsWith("/")) {
      baseUrl = baseUrl.slice(0, -1);
    }

    this.baseUrl = baseUrl;

    this.authModule = new AuthModule(this.baseUrl);
    this.recipeModule = new RecipeModule(this.baseUrl);
    this.mealModule = new MealModule(this.baseUrl);
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

  async updateRecipeName(
    recipeId: string,
    userId: string,
    newName: string,
  ): Promise<JSENDResponse<RecipeDTO>> {
    return this.recipeModule.updateRecipeName(recipeId, userId, newName);
  }

  async deleteRecipe(
    recipeId: string,
    userId: string,
  ): Promise<JSENDResponse<null>> {
    return this.recipeModule.deleteRecipe(recipeId, userId);
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
