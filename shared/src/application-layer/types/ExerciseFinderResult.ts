import { ExerciseDTO, ExternalExerciseRefDTO } from "../dtos";

export type ExerciseFinderResult = {
  exercise: Omit<ExerciseDTO, "id" | "createdAt" | "updatedAt">;
  externalRef: Omit<ExternalExerciseRefDTO, "exerciseId" | "createdAt">;
};
