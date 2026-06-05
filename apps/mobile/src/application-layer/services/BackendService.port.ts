import {
  AssembledDayDTO,
  CreateIngredientLineData,
  DayDTO,
  DayEntry,
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
  duplicateRecipe(
    recipeId: string,
    userId: string,
    newName?: string,
  ): Promise<JSENDResponse<RecipeDTO>>;
  addIngredientToRecipe(
    recipeId: string,
    userId: string,
    ingredient: CreateIngredientLineData,
  ): Promise<JSENDResponse<RecipeDTO>>;

  getAllRecipesForUser(userId: string): Promise<JSENDResponse<RecipeDTO[]>>;

  updateRecipeName(
    recipeId: string,
    userId: string,
    newName: string,
  ): Promise<JSENDResponse<RecipeDTO>>;
  updateRecipeImage(
    recipeId: string,
    userId: string,
    newImageBuffer: Buffer,
  ): Promise<JSENDResponse<RecipeDTO>>;

  deleteRecipe(recipeId: string, userId: string): Promise<JSENDResponse<null>>;
  deleteIngredientFromRecipe(
    recipeId: string,
    ingredientId: string,
    userId: string,
  ): Promise<JSENDResponse<RecipeDTO>>;
  getRecipeForUser(
    recipeId: string,
    userId: string,
  ): Promise<JSENDResponse<RecipeDTO>>;

  // Days
  createDay(
    day: number,
    month: number,
    year: number,
    userId: string,
  ): Promise<JSENDResponse<DayDTO>>;
  addMultipleMealsToMultipleDays(
    recipeIds: string[],
    dayIds: string[],
    userId: string,
  ): Promise<JSENDResponse<DayDTO[]>>;
  getLastDayWithCaloriesGoal(): Promise<JSENDResponse<DayDTO | null>>;
  getLastNumberOfDays(numberOfDays: number): Promise<JSENDResponse<DayEntry[]>>;

  setCaloriesGoalForDayAndUser(
    dayId: string,
    userId: string,
    newCaloriesGoal: number,
  ): Promise<JSENDResponse<DayDTO>>;

  updateUserWeightForDay(
    dayId: string,
    userId: string,
    newWeightInKg: number,
  ): Promise<JSENDResponse<DayDTO>>;

  addMultipleMealsToDay(
    dayId: string,
    recipeIds: string[],
    userId: string,
  ): Promise<JSENDResponse<DayDTO>>;

  removeMealFromDay(
    dayId: string,
    mealId: string,
    userId: string,
  ): Promise<JSENDResponse<DayDTO>>;

  addFakeMealToDay(
    dayId: string,
    name: string,
    calories: number,
    protein: number,
  ): Promise<JSENDResponse<DayDTO>>;

  removeFakeMealFromDay(
    dayId: string,
    fakeMealId: string,
    userId: string,
  ): Promise<JSENDResponse<DayDTO>>;

  getAssembledDayById(
    dayId: string,
  ): Promise<JSENDResponse<AssembledDayDTO | null>>;
}
