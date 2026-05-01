import { ExerciseDTO } from "@/application-layer/dtos/ExerciseDTO";
import { ExternalExerciseRefDTO } from "@/application-layer/dtos/ExternalExerciseRefDTO";

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
