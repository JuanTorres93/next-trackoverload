import { ExerciseDTO } from "shared";

import { Exercise } from "../../domain/entities/exercise/Exercise";

export function toExerciseDTO(exercise: Exercise): ExerciseDTO {
  return {
    id: exercise.id,
    name: exercise.name,
    userId: exercise.userId,
    createdAt: exercise.createdAt.toISOString(),
    updatedAt: exercise.updatedAt.toISOString(),
  };
}
