import {
  CreateIngredientLineData,
  ExerciseFinderResult,
  JSENDResponse,
  RecipeDTO,
  UserDTO,
} from "shared";

export interface BackendService {
  getExerciseByFuzzyName(
    name: string,
  ): Promise<JSENDResponse<ExerciseFinderResult[]>>;

  // Auth
  createUser(
    name: string,
    plainPassword: string,
    email: string,
  ): Promise<JSENDResponse<UserDTO>>;
  loginUser(
    email: string,
    plainPassword: string,
  ): Promise<JSENDResponse<string>>;
  logoutUser(): Promise<string>;

  // Recipes
  createRecipe(
    userId: string,
    recipeName: string,
    ingredientLinesInfo: CreateIngredientLineData[],
    imageBuffer?: Buffer,
  ): Promise<JSENDResponse<RecipeDTO>>;
  getAllRecipesForUser(userId: string): Promise<JSENDResponse<RecipeDTO[]>>;
}
