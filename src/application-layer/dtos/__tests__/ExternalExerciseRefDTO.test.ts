import * as dto from "@/../tests/dtoProperties";
import { ExternalExerciseRef } from "@/domain/entities/externalexerciseref/ExternalExerciseRef";

import * as externalExerciseRefTestProps from "../../../../tests/createProps/externalExerciseRefTestProps";
import {
  ExternalExerciseRefDTO,
  fromExternalExerciseRefDTO,
  toExternalExerciseRefDTO,
} from "../ExternalExerciseRefDTO";

describe("ExternalExerciseRefDTO", () => {
  let externalExerciseRef: ExternalExerciseRef;
  let externalExerciseRefDTO: ExternalExerciseRefDTO;

  beforeEach(() => {
    externalExerciseRef =
      externalExerciseRefTestProps.createTestExternalExerciseRef();
  });

  describe("toExternalExerciseRefDTO", () => {
    beforeEach(() => {
      externalExerciseRefDTO = toExternalExerciseRefDTO(externalExerciseRef);
    });

    it("should have a prop for each external exercise ref getter", () => {
      expect(externalExerciseRefDTO).not.toBeInstanceOf(ExternalExerciseRef);

      for (const getter of dto.externalExerciseRefDTOProperties) {
        expect(externalExerciseRefDTO).toHaveProperty(getter);
      }
    });

    it("should convert ExternalExerciseRef to ExternalExerciseRefDTO", () => {
      expect(externalExerciseRefDTO).toEqual({
        externalId: externalExerciseRef.externalId,
        source: externalExerciseRef.source,
        exerciseId: externalExerciseRef.exerciseId,
        createdAt: externalExerciseRef.createdAt.toISOString(),
      });
    });
  });

  describe("fromExternalExerciseRefDTO", () => {
    let recreatedRef: ExternalExerciseRef;

    beforeEach(() => {
      externalExerciseRefDTO = toExternalExerciseRefDTO(externalExerciseRef);
      recreatedRef = fromExternalExerciseRefDTO(externalExerciseRefDTO);
    });

    it("should convert ExternalExerciseRefDTO back to ExternalExerciseRef", () => {
      expect(recreatedRef).toBeInstanceOf(ExternalExerciseRef);
    });

    it("should preserve all properties when converting DTO to entity", () => {
      expect(recreatedRef.externalId).toBe(externalExerciseRef.externalId);
      expect(recreatedRef.source).toBe(externalExerciseRef.source);
      expect(recreatedRef.exerciseId).toBe(externalExerciseRef.exerciseId);
    });

    it("should preserve date when converting DTO to entity", () => {
      expect(recreatedRef.createdAt.getTime()).toBe(
        externalExerciseRef.createdAt.getTime(),
      );
    });

    it("should be bidirectional (entity -> DTO -> entity)", () => {
      const roundTripDTO = toExternalExerciseRefDTO(externalExerciseRef);
      const recreated = fromExternalExerciseRefDTO(roundTripDTO);

      expect(recreated.externalId).toBe(externalExerciseRef.externalId);
      expect(recreated.source).toBe(externalExerciseRef.source);
      expect(recreated.exerciseId).toBe(externalExerciseRef.exerciseId);
      expect(recreated.createdAt.getTime()).toBe(
        externalExerciseRef.createdAt.getTime(),
      );
    });
  });
});
