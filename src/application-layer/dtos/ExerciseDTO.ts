import { Exercise } from '@/domain/entities/exercise/Exercise';

export type ExerciseDTO = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export function toExerciseDTO(exercise: Exercise): ExerciseDTO {
  return {
    id: exercise.id,
    name: exercise.name,
    createdAt: exercise.createdAt.toISOString(),
    updatedAt: exercise.updatedAt.toISOString(),
  };
}
