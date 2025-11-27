import { Id } from '@/domain/types/Id/Id';

export const userId = 'user-1';
export const dateId = new Date('2023-10-01');

export const validDayProps = {
  id: dateId,
  userId: Id.create(userId),
  meals: [], // TODO make deep copy in constructor if testing issues arise
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const recipePropsNoIngredientLines = {
  id: Id.create('recipe1'),
  userId,
  name: 'Test Recipe',
  createdAt: new Date(),
  updatedAt: new Date(),
};
export const validWorkoutTemplateProps = {
  id: Id.create('1'),
  userId,
  name: 'Push',
  exercises: [
    { exerciseId: 'ex1', sets: 3 },
    { exerciseId: 'ex2', sets: 4 },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const validWorkoutProps = {
  id: Id.create('workout-1'),
  userId,
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
  id: Id.create('ex1'),
  name: 'Test Exercise',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const validFakeMealProps = {
  id: Id.create('fakeMeal1'),
  userId: Id.create(userId),
  name: 'Fake Chicken Breast',
  protein: 30,
  calories: 200,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const validIngredientProps = {
  id: Id.create('ing1'),
  name: 'Chicken Breast',
  nutritionalInfoPer100g: {
    calories: 100,
    protein: 15,
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const ingredientLinePropsNoIngredient = {
  id: Id.create('line1'),
  quantityInGrams: 200,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mealPropsNoIngredientLines = {
  id: Id.create('meal1'),
  userId,
  name: 'Chicken Meal',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const validUserProps = {
  id: Id.create(userId),
  name: 'Test User',
  customerId: 'customer-123',
  createdAt: new Date(),
  updatedAt: new Date(),
};
