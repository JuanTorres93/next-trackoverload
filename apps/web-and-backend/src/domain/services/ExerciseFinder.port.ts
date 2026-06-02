import { ExerciseFinderResult } from "shared";

export const EXERCISES_PER_PAGE = 20;

export interface ExerciseFinder {
  findExercisesByFuzzyName(
    name: string,
    page?: number,
  ): Promise<ExerciseFinderResult[]>;
}
