import { getGetters } from '@/application-layer/dtos/__tests__/_getGettersUtil';
import * as vp from '@/../tests/createProps';

import { Exercise } from '@/domain/entities/exercise/Exercise';
import { ExternalIngredientRef } from '@/domain/entities/externalingredientref/ExternalIngredientRef';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { Meal } from '@/domain/entities/meal/Meal';
import { Workout } from '@/domain/entities/workout/Workout';
import { WorkoutLine } from '@/domain/entities/workoutline/WorkoutLine';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { WorkoutTemplateLine } from '@/domain/entities/workouttemplateline/WorkoutTemplateLine';
import { User } from '@/domain/entities/user/User';
import { Day } from '@/domain/entities/day/Day';

// FakeMeal DTO
const sampleFakeMeal = FakeMeal.create({
  ...vp.validFakeMealProps,
});
export const fakeMealDTOProperties = getGetters(sampleFakeMeal);

// Ingredient DTO
const sampleIngredient = Ingredient.create({
  ...vp.validIngredientProps,
});
export const ingredientDTOProperties = getGetters(sampleIngredient);

// ExternalIngredientRef DTO
const sampleExternalIngredientRef = ExternalIngredientRef.create({
  ...vp.validExternalIngredientRefProps,
});
export const externalIngredientRefDTOProperties = getGetters(
  sampleExternalIngredientRef
);

// IngredientLine DTO
const sampleIngredientLine = IngredientLine.create({
  ...vp.ingredientLineRecipePropsNoIngredient,
  ingredient: sampleIngredient,
});
export const ingredientLineDTOProperties = getGetters(sampleIngredientLine);

// Meal DTO
const sampleMeal = Meal.create({
  ...vp.mealPropsNoIngredientLines,
  ingredientLines: [sampleIngredientLine],
});
export const mealDTOProperties = getGetters(sampleMeal);

// Recipe DTO
const sampleRecipe = Recipe.create({
  ...vp.recipePropsNoIngredientLines,
  ingredientLines: [sampleIngredientLine],
});
export const recipeDTOProperties = getGetters(sampleRecipe);

// User
const sampleUser = User.create({
  ...vp.validUserProps,
});
export const userDTOProperties = getGetters(sampleUser);

// Exercise DTO
const sampleExercise = Exercise.create({
  ...vp.validExerciseProps,
});
export const exerciseDTOProperties = getGetters(sampleExercise);

// WorkoutLine DTO
const sampleWorkoutLine = WorkoutLine.create({
  ...vp.validWorkoutLineProps,
});
export const workoutLineDTOProperties = getGetters(sampleWorkoutLine);

// Workout
const sampleWorkout = Workout.create({
  ...vp.validWorkoutProps,
  exercises: [sampleWorkoutLine],
});
export const workoutDTOProperties = getGetters(sampleWorkout);

// WorkoutTemplate DTO
const sampleWorkoutTemplate = WorkoutTemplate.create({
  ...vp.validWorkoutTemplateProps(),
});
export const workoutTemplateDTOProperties = getGetters(sampleWorkoutTemplate);

// WorkoutTemplateLine DTO
const sampleWorkoutTemplateLine = WorkoutTemplateLine.create({
  ...vp.validWorkoutTemplateLineProps,
});
export const workoutTemplateLineDTOProperties = getGetters(
  sampleWorkoutTemplateLine
);

// Day DTO
const sampleDay = Day.create({
  ...vp.validDayProps(),
});
export const dayDTOProperties = getGetters(sampleDay);
export const assembledDayDTOProperties = [
  ...dayDTOProperties,
  'meals',
  'fakeMeals',
];
