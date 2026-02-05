import { WorkoutLine } from '@/domain/entities/workoutline/WorkoutLine';
import { userId } from './userTestProps';

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
    weightInKg: 50,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const workoutLine2 = WorkoutLine.create({
    id: 'line2',
    workoutId: 'workout-1',
    exerciseId: 'ex2',
    setNumber: 1,
    reps: 8,
    weightInKg: 70,
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
      weightInKg: 50,
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const validWorkoutLineProps = {
  id: 'workoutline-1',
  workoutId: 'workout-1',
  exerciseId: 'exercise-1',
  setNumber: 1,
  reps: 10,
  weightInKg: 53.5,
  createdAt: new Date(),
  updatedAt: new Date(),
};
