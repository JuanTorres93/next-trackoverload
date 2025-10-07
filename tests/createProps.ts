export const userId = 'user-1';
export const dateId = new Date('2023-10-01');

export const validDayProps = {
  id: dateId,
  userId,
  meals: [], // TODO make deep copy in constructor if testing issues arise
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const recipePropsNoIngredientLines = {
  id: 'recipe1',
  userId,
  name: 'Test Recipe',
  createdAt: new Date(),
  updatedAt: new Date(),
};
export const validWorkoutTemplateProps = {
  id: '1',
  userId: 'user1',
  name: 'Push',
  exercises: [
    { exerciseId: 'ex1', sets: 3 },
    { exerciseId: 'ex2', sets: 4 },
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
  id: 'fakemeal1',
  name: 'Fake Chicken Breast',
  protein: 30,
  calories: 200,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const validIngredientProps = {
  id: 'ing1',
  name: 'Chicken Breast',
  nutritionalInfoPer100g: {
    calories: 100,
    protein: 15,
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const ingredientLinePropsNoIngredient = {
  id: 'line1',
  quantityInGrams: 200,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mealPropsNoIngredientLines = {
  id: 'meal1',
  name: 'Chicken Meal',
  createdAt: new Date(),
  updatedAt: new Date(),
};
