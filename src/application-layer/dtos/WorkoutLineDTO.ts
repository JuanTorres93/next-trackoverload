import { WorkoutLine } from '@/domain/entities/workoutline/WorkoutLine';

export type WorkoutLineDTO = {
  id: string;
  workoutId: string;
  exerciseId: string;
  setNumber: number;
  reps: number;
  weightInKg: number;
  createdAt: string;
  updatedAt: string;
};

export function toWorkoutLineDTO(workoutLine: WorkoutLine): WorkoutLineDTO {
  return {
    id: workoutLine.id,
    workoutId: workoutLine.workoutId,
    exerciseId: workoutLine.exerciseId,
    setNumber: workoutLine.setNumber,
    reps: workoutLine.reps,
    weightInKg: workoutLine.weightInKg,
    createdAt: workoutLine.createdAt.toISOString(),
    updatedAt: workoutLine.updatedAt.toISOString(),
  };
}
