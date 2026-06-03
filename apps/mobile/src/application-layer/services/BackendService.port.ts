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

  createUser(
    name: string,
    plainPassword: string,
    email: string,
  ): Promise<JSENDResponse<UserDTO>>;

  createRecipe(
    userId: string,
    recipeName: string,
    ingredientLinesInfo: CreateIngredientLineData[],
    imageBuffer?: Buffer,
  ): Promise<JSENDResponse<RecipeDTO>>;
}
