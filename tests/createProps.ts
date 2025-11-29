export const userId = 'user-1';
export const dateId = new Date('2023-10-01');

export const validDayProps = {
  id: dateId,
  userId: userId,
  meals: [], // TODO make deep copy in constructor if testing issues arise
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const recipePropsNoIngredientLines = {
  id: 'recipe1',
  userId: userId,
  name: 'Test Recipe',
  createdAt: new Date(),
  updatedAt: new Date(),
};
export const validWorkoutTemplateProps = {
  id: '1',
  userId: userId,
  name: 'Push',
  exercises: [
    { exerciseId: 'ex1', sets: 3 },
    { exerciseId: 'ex2', sets: 4 },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export function validWorkoutPropsNoExercises() {
  return {
    id: 'workout-1',
    userId: userId,
    name: 'Push',
    workoutTemplateId: 'template-1',
    exercises: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
export const validWorkoutProps = {
  id: 'workout-1',
  userId: userId,
  name: 'Push',
  workoutTemplateId: 'template-1',
  exercises: [
    {
      exerciseId: 'ex1',
      setNumber: 1,
      reps: 10,
      weight: 50,
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const validExerciseProps = {
  id: 'ex1',
  name: 'Test Exercise',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const validFakeMealProps = {
  id: 'fakeMeal1',
  userId: userId,
  name: 'Fake Chicken Breast',
  protein: 30,
  calories: 200,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const validIngredientProps = {
  id: 'ing1',
  name: 'Chicken Breast',
  calories: 100,
  protein: 15,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const ingredientLinePropsNoIngredient = {
  id: 'line1',
  recipeId: 'recipe1',
  quantityInGrams: 200,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mealPropsNoIngredientLines = {
  id: 'meal1',
  userId: userId,
  name: 'Chicken Meal',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const validUserProps = {
  id: userId,
  name: 'Test User',
  customerId: 'customer-123',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const validWorkoutLineProps = {
  id: 'workoutline-1',
  workoutId: 'workout-1',
  exerciseId: 'exercise-1',
  setNumber: 1,
  reps: 10,
  weight: 53.5,
  createdAt: new Date(),
  updatedAt: new Date(),
};
