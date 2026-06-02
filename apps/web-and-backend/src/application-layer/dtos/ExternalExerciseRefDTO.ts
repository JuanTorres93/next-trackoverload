import { ExternalExerciseRefDTO } from "shared";

import { ExternalExerciseRef } from "../../domain/entities/externalexerciseref/ExternalExerciseRef";

export function toExternalExerciseRefDTO(
  externalExerciseRef: ExternalExerciseRef,
): ExternalExerciseRefDTO {
  return {
    externalId: externalExerciseRef.externalId,
    source: externalExerciseRef.source,
    exerciseId: externalExerciseRef.exerciseId,
    createdAt: externalExerciseRef.createdAt.toISOString(),
  };
}

export function fromExternalExerciseRefDTO(
  dto: ExternalExerciseRefDTO,
): ExternalExerciseRef {
  return ExternalExerciseRef.create({
    externalId: dto.externalId,
    source: dto.source,
    exerciseId: dto.exerciseId,
    createdAt: new Date(dto.createdAt),
  });
}
