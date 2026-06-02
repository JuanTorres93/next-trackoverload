import { WorkoutDTO } from "shared";

import { Workout } from "../../domain/entities/workout/Workout";
import { toWorkoutLineDTO } from "./WorkoutLineDTO";

export function toWorkoutDTO(workout: Workout): WorkoutDTO {
  return {
    id: workout.id,
    userId: workout.userId,
    name: workout.name,
    workoutTemplateId: workout.workoutTemplateId,
    exercises: workout.exercises.map(toWorkoutLineDTO),
    createdAt: workout.createdAt.toISOString(),
    updatedAt: workout.updatedAt.toISOString(),
  };
}
