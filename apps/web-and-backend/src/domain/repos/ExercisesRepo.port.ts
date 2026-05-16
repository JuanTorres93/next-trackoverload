import { Exercise } from "../entities/exercise/Exercise";

export interface ExercisesRepo {
  getAllExercises(): Promise<Exercise[]>;
  getExerciseById(id: string): Promise<Exercise | null>;
  getExercisesByIds(ids: string[]): Promise<Exercise[]>;

  saveExercise(exercise: Exercise): Promise<void>;

  deleteExercise(id: string): Promise<void>;
}
