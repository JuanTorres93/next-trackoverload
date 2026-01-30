import { WorkoutTemplateLine } from '@/domain/entities/workouttemplateline/WorkoutTemplateLine';
import { WorkoutLine } from '@/domain/entities/workoutline/WorkoutLine';
import { userId } from './createProps/userTestProps';
import { validIngredientProps } from './createProps/ingredientTestProps';

export const dateId = new Date('2023-10-01');

export function validDayProps() {
  return {
    day: 1,
    month: 10,
    year: 2023,
    userId: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function validWorkoutTemplateProps() {
  const templateId = '1';

  const templateLine1 = WorkoutTemplateLine.create({
    id: 'line1',
    templateId,
    exerciseId: 'ex1',
    sets: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const templateLine2 = WorkoutTemplateLine.create({
    id: 'line2',
    templateId,
    exerciseId: 'ex2',
    sets: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return {
    id: '1',
    userId: userId,
    name: 'Test workout template',
    exercises: [templateLine1, templateLine2],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

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

export function validWorkoutPropsWithExercises() {
  const workoutLine1 = WorkoutLine.create({
    id: 'line1',
    workoutId: 'workout-1',
    exerciseId: 'ex1',
    setNumber: 1,
    reps: 10,
    weight: 50,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const workoutLine2 = WorkoutLine.create({
    id: 'line2',
    workoutId: 'workout-1',
    exerciseId: 'ex2',
    setNumber: 1,
    reps: 8,
    weight: 70,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return {
    id: 'workout-1',
    userId: userId,
    name: 'Push',
    workoutTemplateId: 'template-1',
    exercises: [workoutLine1, workoutLine2],
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

export const validExternalIngredientRefProps = {
  externalId: 'ext-ing-1',
  source: 'openfoodfacts',
  ingredientId: validIngredientProps.id,
  createdAt: new Date(),
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

export const validWorkoutTemplateLineProps = {
  id: 'workouttemplateline-1',
  templateId: 'template-1',
  exerciseId: 'exercise-1',
  sets: 3,
  createdAt: new Date(),
  updatedAt: new Date(),
};
