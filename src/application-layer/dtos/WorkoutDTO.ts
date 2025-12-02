import { Workout } from '@/domain/entities/workout/Workout';
import { WorkoutLineDTO, toWorkoutLineDTO } from './WorkoutLineDTO';

export type WorkoutDTO = {
  id: string;
  userId: string;
  name: string;
  workoutTemplateId: string;
  exercises: WorkoutLineDTO[];
  createdAt: string;
  updatedAt: string;
};

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
