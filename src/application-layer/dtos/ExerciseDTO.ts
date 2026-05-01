import { Exercise } from "@/domain/entities/exercise/Exercise";

export type ExerciseDTO = {
  id: string;
  name: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
};

export function toExerciseDTO(exercise: Exercise): ExerciseDTO {
  return {
    id: exercise.id,
    name: exercise.name,
    userId: exercise.userId,
    createdAt: exercise.createdAt.toISOString(),
    updatedAt: exercise.updatedAt.toISOString(),
  };
}
