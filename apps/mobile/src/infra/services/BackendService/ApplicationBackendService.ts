import {
  CreateIngredientLineData,
  DayDTO,
  DayEntry,
  ExerciseFinderResult,
  JSENDResponse,
  RecipeDTO,
  UserDTO,
} from "shared";

import { BackendService } from "@/application-layer/services/BackendService.port";

import { AuthModule } from "./modules/AuthModule";
import { DayModule } from "./modules/DayModule";
import { ExerciseModule } from "./modules/ExerciseModule";
import { RecipeModule } from "./modules/RecipeModule";

export class ApplicationBackendService implements BackendService {
  private baseUrl: string;

  private authModule: AuthModule;
  private recipeModule: RecipeModule;
  private dayModule: DayModule;
  private exerciseModule: ExerciseModule;

  constructor(baseUrl: string) {
    if (baseUrl.endsWith("/")) {
      baseUrl = baseUrl.slice(0, -1);
    }

    this.baseUrl = baseUrl;

    this.authModule = new AuthModule(this.baseUrl);
    this.recipeModule = new RecipeModule(this.baseUrl);
    this.dayModule = new DayModule(this.baseUrl);
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

  async addIngredientToRecipe(
    recipeId: string,
    userId: string,
    ingredient: CreateIngredientLineData,
  ): Promise<JSENDResponse<RecipeDTO>> {
    return this.recipeModule.addIngredientToRecipe(
      recipeId,
      userId,
      ingredient,
    );
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
  async updateRecipeImage(
    recipeId: string,
    userId: string,
    newImageBuffer: Buffer,
  ): Promise<JSENDResponse<RecipeDTO>> {
    return this.recipeModule.updateRecipeImage(
      recipeId,
      userId,
      newImageBuffer,
    );
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

  /////////////// DAYS
  async createDay(
    day: number,
    month: number,
    year: number,
    userId: string,
  ): Promise<JSENDResponse<DayDTO>> {
    return this.dayModule.createDay(day, month, year, userId);
  }

  async addMultipleMealsToMultipleDays(
    recipeIds: string[],
    dayIds: string[],
    userId: string,
  ): Promise<JSENDResponse<DayDTO[]>> {
    return this.dayModule.addMultipleMealsToMultipleDays(
      recipeIds,
      dayIds,
      userId,
    );
  }

  async getLastDayWithCaloriesGoal(): Promise<JSENDResponse<DayDTO | null>> {
    return this.dayModule.getLastDayWithCaloriesGoal();
  }

  async getLastNumberOfDays(
    numberOfDays: number,
  ): Promise<JSENDResponse<DayEntry[]>> {
    return this.dayModule.getLastNumberOfDays(numberOfDays);
  }
}
