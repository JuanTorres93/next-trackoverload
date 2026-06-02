import { WorkoutLineDTO } from "shared";

import { WorkoutLine } from "../../domain/entities/workoutline/WorkoutLine";

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
