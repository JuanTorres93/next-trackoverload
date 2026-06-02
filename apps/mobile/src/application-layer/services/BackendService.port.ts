import {
  ExerciseFinderResult,
  JSENDResponse,
  RecipeDTO,
  UserDTO,
} from "shared";

export interface BackendService {
  getExerciseByFuzzyName(
    name: string,
  ): Promise<JSENDResponse<ExerciseFinderResult[]>>;

  createUser(
    name: string,
    plainPassword: string,
    email: string,
  ): Promise<JSENDResponse<UserDTO>>;

  createRecipe(
    userId: string,
    recipeName: string,
    // TODO NEXT: export CreateIngredientLineData to shared and use it here
    ingredientLinesInfo: { line: string; ingredients: string[] }[],
    imageBuffer?: Buffer,
  ): Promise<JSENDResponse<RecipeDTO>>;
}
