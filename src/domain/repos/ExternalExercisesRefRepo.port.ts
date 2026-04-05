import { ExternalExerciseRef } from "../entities/externalexerciseref/ExternalExerciseRef";

export interface ExternalExercisesRefRepo {
  getAllExternalExercisesRef(): Promise<ExternalExerciseRef[]>;
  getByExternalIdAndSource(
    externalId: string,
    source: string,
  ): Promise<ExternalExerciseRef | null>;
  getByExternalIdsAndSource(
    externalIds: string[],
    source: string,
  ): Promise<ExternalExerciseRef[]>;

  save(externalExerciseRef: ExternalExerciseRef): Promise<void>;

  delete(externalId: string): Promise<void>;
}
