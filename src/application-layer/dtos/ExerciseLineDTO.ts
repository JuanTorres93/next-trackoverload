import { ExerciseLine } from '@/domain/entities/workout/Workout';

export type ExerciseLineDTO = {
  exerciseId: string;
  setNumber: number;
  reps: number;
  weight: number; // in kg
};

export function toExerciseLineDTO(exerciseLine: ExerciseLine): ExerciseLineDTO {
  return {
    exerciseId: exerciseLine.exerciseId,
    setNumber: exerciseLine.setNumber,
    reps: exerciseLine.reps,
    weight: exerciseLine.weight,
  };
}
