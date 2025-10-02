import { Exercise, ExerciseUpdateProps } from '../exercise/Exercise';

export interface ExercisesRepo {
  getAllExercises(): Promise<Exercise[]>;
  getExerciseById(id: string): Promise<Exercise | null>;
  saveExercise(exercise: Exercise): Promise<void>;
  deleteExercise(id: string): Promise<void>;
  updateExercise(id: string, patch: ExerciseUpdateProps): Promise<Exercise>;
}
