import { WorkoutLine } from '@/domain/entities/workoutline/WorkoutLine';
import { userId } from './userTestProps';
import { Workout, WorkoutCreateProps } from '@/domain/entities/workout/Workout';

import { validWorkoutTemplateProps } from './workoutTemplateTestProps';

import { validExerciseProps } from './exerciseTestProps';

const workoutId = 'workout-1';
const exerciseId = validExerciseProps.id;

export function validWorkoutPropsNoExercises() {
  return {
    id: workoutId,
    userId: userId,
    name: 'Push',
    workoutTemplateId: validWorkoutTemplateProps().id,
    exercises: [],
  };
}

export function validWorkoutPropsWithExercises() {
  const workoutLine1 = WorkoutLine.create({
    id: 'line1',
    workoutId: workoutId,
    exerciseId: exerciseId,
    setNumber: 1,
    reps: 10,
    weightInKg: 50,
  });

  const workoutLine2 = WorkoutLine.create({
    id: 'line2',
    workoutId: workoutId,
    exerciseId: 'ex2',
    setNumber: 1,
    reps: 8,
    weightInKg: 70,
  });

  return {
    id: workoutId,
    userId: userId,
    name: 'Push',
    workoutTemplateId: validWorkoutTemplateProps().id,
    exercises: [workoutLine1, workoutLine2],
  };
}

export const validWorkoutProps = {
  id: workoutId,
  userId: userId,
  name: 'Push',
  workoutTemplateId: validWorkoutTemplateProps().id,
  exercises: [
    {
      exerciseId: exerciseId,
      setNumber: 1,
      reps: 10,
      weightInKg: 50,
    },
  ],
};

export const validWorkoutLineProps = {
  id: 'workoutline-1',
  workoutId: workoutId,
  exerciseId: exerciseId,
  setNumber: 1,
  reps: 10,
  weightInKg: 53.5,
};

export function createTestWorkout(
  props?: Partial<WorkoutCreateProps>,
): Workout {
  const validProps = validWorkoutPropsWithExercises();

  return Workout.create({
    id: props?.id || validProps.id,
    userId: props?.userId || validProps.userId,
    name: props?.name || validProps.name,
    workoutTemplateId: props?.workoutTemplateId || validProps.workoutTemplateId,
    exercises: props?.exercises || validProps.exercises,
    createdAt: props?.createdAt || undefined,
    updatedAt: props?.updatedAt || undefined,
  });
}
