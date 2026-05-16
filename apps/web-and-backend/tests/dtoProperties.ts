import { getGetters } from "../src/application-layer/dtos/__tests__/_getGettersUtil";
import { Day } from "../src/domain/entities/day/Day";
import { Exercise } from "../src/domain/entities/exercise/Exercise";
import { ExternalExerciseRef } from "../src/domain/entities/externalexerciseref/ExternalExerciseRef";
import { ExternalIngredientRef } from "../src/domain/entities/externalingredientref/ExternalIngredientRef";
import { FakeMeal } from "../src/domain/entities/fakemeal/FakeMeal";
import { Ingredient } from "../src/domain/entities/ingredient/Ingredient";
import { IngredientLine } from "../src/domain/entities/ingredientline/IngredientLine";
import { Meal } from "../src/domain/entities/meal/Meal";
import { Recipe } from "../src/domain/entities/recipe/Recipe";
import { User } from "../src/domain/entities/user/User";
import { Workout } from "../src/domain/entities/workout/Workout";
import { WorkoutLine } from "../src/domain/entities/workoutline/WorkoutLine";
import { WorkoutTemplate } from "../src/domain/entities/workouttemplate/WorkoutTemplate";
import { WorkoutTemplateLine } from "../src/domain/entities/workouttemplateline/WorkoutTemplateLine";

import * as dayTestProps from "./createProps/dayTestProps";
import * as exerciseTestProps from "./createProps/exerciseTestProps";
import * as externalExerciseRefTestProps from "./createProps/externalExerciseRefTestProps";
import * as externalIngredientRefTestProps from "./createProps/externalIngredientRefTestProps";
import * as fakeMealTestProps from "./createProps/fakeMealTestProps";
import * as ingredientTestProps from "./createProps/ingredientTestProps";
import * as mealTestProps from "./createProps/mealTestProps";
import * as recipeTestProps from "./createProps/recipeTestProps";
import * as userTestProps from "./createProps/userTestProps";
import * as workoutTemplateTestProps from "./createProps/workoutTemplateTestProps";
import * as workoutTestProps from "./createProps/workoutTestProps";

// FakeMeal DTO
const sampleFakeMeal = FakeMeal.create({
  ...fakeMealTestProps.validFakeMealProps,
});
export const fakeMealDTOProperties = getGetters(sampleFakeMeal);

// Ingredient DTO
const sampleIngredient = Ingredient.create({
  ...ingredientTestProps.validIngredientProps,
});
export const ingredientDTOProperties = getGetters(sampleIngredient);

// ExternalIngredientRef DTO
const sampleExternalIngredientRef = ExternalIngredientRef.create({
  ...externalIngredientRefTestProps.validExternalIngredientRefProps,
});
export const externalIngredientRefDTOProperties = getGetters(
  sampleExternalIngredientRef,
);

// ExternalExerciseRef DTO
const sampleExternalExerciseRef = ExternalExerciseRef.create({
  ...externalExerciseRefTestProps.validExternalExerciseRefProps,
});
export const externalExerciseRefDTOProperties = getGetters(
  sampleExternalExerciseRef,
);

// IngredientLine DTO
const sampleIngredientLine = IngredientLine.create({
  ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
  ingredient: sampleIngredient,
});
export const ingredientLineDTOProperties = getGetters(sampleIngredientLine);

// Meal DTO
const sampleMeal = Meal.create({
  ...mealTestProps.mealPropsNoIngredientLines,
  ingredientLines: [sampleIngredientLine],
});
export const mealDTOProperties = getGetters(sampleMeal);

// Recipe DTO
const sampleRecipe = Recipe.create({
  ...recipeTestProps.recipePropsNoIngredientLines,
  ingredientLines: [sampleIngredientLine],
});
export const recipeDTOProperties = getGetters(sampleRecipe);

// User
const sampleUser = User.create({
  ...userTestProps.validUserProps,
});
const allUserGetters = getGetters(sampleUser);
export const userDTOProperties = allUserGetters.filter(
  (getter) => getter !== "hashedPassword",
);

// Exercise DTO
const sampleExercise = Exercise.create({
  ...exerciseTestProps.validExerciseProps,
});
export const exerciseDTOProperties = getGetters(sampleExercise);

// WorkoutLine DTO
const sampleWorkoutLine = WorkoutLine.create({
  ...workoutTestProps.validWorkoutLineProps,
});
export const workoutLineDTOProperties = getGetters(sampleWorkoutLine);

// Workout
const sampleWorkout = Workout.create({
  ...workoutTestProps.validWorkoutProps,
  exercises: [sampleWorkoutLine],
});
export const workoutDTOProperties = getGetters(sampleWorkout);

// WorkoutTemplate DTO
const sampleWorkoutTemplate = WorkoutTemplate.create({
  ...workoutTemplateTestProps.validWorkoutTemplateProps(),
});
export const workoutTemplateDTOProperties = getGetters(sampleWorkoutTemplate);

// WorkoutTemplateLine DTO
const sampleWorkoutTemplateLine = WorkoutTemplateLine.create({
  ...workoutTemplateTestProps.validWorkoutTemplateLineProps,
});
export const workoutTemplateLineDTOProperties = getGetters(
  sampleWorkoutTemplateLine,
);

// Day DTO
const sampleDay = Day.create({
  ...dayTestProps.validDayProps(),
});
export const dayDTOProperties = getGetters(sampleDay);
export const assembledDayDTOProperties = [
  ...dayDTOProperties,
  "meals",
  "fakeMeals",
  "totalCalories",
  "totalProtein",
  "isToday",
  "isPast",
];
