import { ExerciseLineDTO } from './ExerciseLineDTO';

export type WorkoutDTO = {
  id: string;
  userId: string;
  name: string;
  workoutTemplateId: string;
  exercises: ExerciseLineDTO[];
  createdAt: string;
  updatedAt: string;
};
