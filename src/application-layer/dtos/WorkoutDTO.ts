import { Workout } from '@/domain/entities/workout/Workout';
import { ExerciseLineDTO, toExerciseLineDTO } from './ExerciseLineDTO';

export type WorkoutDTO = {
  id: string;
  userId: string;
  name: string;
  workoutTemplateId: string;
  exercises: ExerciseLineDTO[];
  createdAt: string;
  updatedAt: string;
};

export function toWorkoutDTO(workout: Workout): WorkoutDTO {
  return {
    id: workout.id,
    userId: workout.userId,
    name: workout.name,
    workoutTemplateId: workout.workoutTemplateId,
    exercises: workout.exercises.map(toExerciseLineDTO),
    createdAt: workout.createdAt.toISOString(),
    updatedAt: workout.updatedAt.toISOString(),
  };
}
