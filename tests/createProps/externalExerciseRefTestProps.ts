import {
  ExternalExerciseRef,
  ExternalExerciseRefCreateProps,
} from "@/domain/entities/externalexerciseref/ExternalExerciseRef";

import { validExerciseProps } from "./exerciseTestProps";

export const validExternalExerciseRefProps = {
  externalId: "ext-ex-1",
  source: "wger",
  exerciseId: validExerciseProps.id,
  createdAt: new Date(),
};

export function createTestExternalExerciseRef(
  props?: Partial<ExternalExerciseRefCreateProps>,
) {
  return ExternalExerciseRef.create({
    externalId: props?.externalId || validExternalExerciseRefProps.externalId,
    source: props?.source || validExternalExerciseRefProps.source,
    exerciseId: props?.exerciseId || validExternalExerciseRefProps.exerciseId,
    createdAt: props?.createdAt || validExternalExerciseRefProps.createdAt,
  });
}
