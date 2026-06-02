import { ExerciseDTO } from "shared";
import { ExternalExerciseRefDTO } from "shared";

export const EXERCISES_PER_PAGE = 20;

export type ExerciseFinderResult = {
  exercise: Omit<ExerciseDTO, "id" | "createdAt" | "updatedAt">;
  externalRef: Omit<ExternalExerciseRefDTO, "exerciseId" | "createdAt">;
};

export interface ExerciseFinder {
  findExercisesByFuzzyName(
    name: string,
    page?: number,
  ): Promise<ExerciseFinderResult[]>;
}
