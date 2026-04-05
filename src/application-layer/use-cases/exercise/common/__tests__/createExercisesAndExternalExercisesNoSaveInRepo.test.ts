import { beforeEach, describe, expect, it } from "vitest";

import { MemoryExercisesRepo } from "@/infra/repos/memory/MemoryExercisesRepo";
import { MemoryExternalExercisesRefRepo } from "@/infra/repos/memory/MemoryExternalExercisesRefRepo";
import { Uuidv4IdGenerator } from "@/infra/services/IdGenerator/Uuidv4IdGenerator/Uuidv4IdGenerator";

import * as exerciseTestProps from "../../../../../../tests/createProps/exerciseTestProps";
import * as externalExerciseRefTestProps from "../../../../../../tests/createProps/externalExerciseRefTestProps";
import {
  CreateExerciseData,
  createExercisesAndExternalExercisesNoSaveInRepo,
} from "../createExercisesAndExternalExercisesNoSaveInRepo";

describe("createExercisesAndExternalExercisesNoSaveInRepo", () => {
  let exercisesRepo: MemoryExercisesRepo;
  let externalExercisesRefRepo: MemoryExternalExercisesRefRepo;

  const idGenerator = new Uuidv4IdGenerator();

  const newExerciseInfo: CreateExerciseData = {
    externalExerciseId: "ext-ex-new",
    source: "wger",
    name: "Bench Press",
  };

  beforeEach(() => {
    exercisesRepo = new MemoryExercisesRepo();
    externalExercisesRefRepo = new MemoryExternalExercisesRefRepo();
  });

  describe("when the exercise does not exist yet", () => {
    it("should create a new exercise and external exercise ref", async () => {
      const result = await createExercisesAndExternalExercisesNoSaveInRepo(
        [newExerciseInfo],
        exercisesRepo,
        externalExercisesRefRepo,
        idGenerator,
      );

      expect(Object.keys(result.createdExercises)).toHaveLength(1);
      expect(Object.keys(result.createdExternalExercises)).toHaveLength(1);
      expect(result.existingExercises).toHaveLength(0);
      expect(result.fetchedExternalExercises).toHaveLength(0);
    });

    it("should link the created exercise and its external ref with the same exerciseId", async () => {
      const result = await createExercisesAndExternalExercisesNoSaveInRepo(
        [newExerciseInfo],
        exercisesRepo,
        externalExercisesRefRepo,
        idGenerator,
      );

      const createdExercise =
        result.createdExercises[newExerciseInfo.externalExerciseId];
      const createdExternalRef =
        result.createdExternalExercises[newExerciseInfo.externalExerciseId];

      expect(createdExercise.id).toBe(createdExternalRef.exerciseId);
      expect(createdExercise.name).toBe(newExerciseInfo.name);
      expect(createdExternalRef.externalId).toBe(
        newExerciseInfo.externalExerciseId,
      );
      expect(createdExternalRef.source).toBe(newExerciseInfo.source);
    });

    it("should include the created exercise in allExercises", async () => {
      const result = await createExercisesAndExternalExercisesNoSaveInRepo(
        [newExerciseInfo],
        exercisesRepo,
        externalExercisesRefRepo,
        idGenerator,
      );

      expect(result.allExercises).toHaveLength(1);
      expect(result.allExercises[0].name).toBe(newExerciseInfo.name);
    });

    it("should create multiple new exercises when none exist", async () => {
      const secondExerciseInfo: CreateExerciseData = {
        externalExerciseId: "ext-ex-new-2",
        source: "wger",
        name: "Squat",
      };

      const result = await createExercisesAndExternalExercisesNoSaveInRepo(
        [newExerciseInfo, secondExerciseInfo],
        exercisesRepo,
        externalExercisesRefRepo,
        idGenerator,
      );

      expect(Object.keys(result.createdExercises)).toHaveLength(2);
      expect(Object.keys(result.createdExternalExercises)).toHaveLength(2);
      expect(result.allExercises).toHaveLength(2);
    });
  });

  describe("when the exercise already exists", () => {
    beforeEach(async () => {
      const existingExercise = exerciseTestProps.createTestExercise();

      const existingExternalRef =
        externalExerciseRefTestProps.createTestExternalExerciseRef({
          exerciseId: existingExercise.id,
        });

      await exercisesRepo.saveExercise(existingExercise);
      await externalExercisesRefRepo.save(existingExternalRef);
    });

    it("should return existing exercise without creating new ones", async () => {
      const existingInfo: CreateExerciseData = {
        externalExerciseId:
          externalExerciseRefTestProps.validExternalExerciseRefProps.externalId,

        source:
          externalExerciseRefTestProps.validExternalExerciseRefProps.source,

        name: "Does not matter",
      };

      const result = await createExercisesAndExternalExercisesNoSaveInRepo(
        [existingInfo],
        exercisesRepo,
        externalExercisesRefRepo,
        idGenerator,
      );

      expect(result.existingExercises).toHaveLength(1);
      expect(result.fetchedExternalExercises).toHaveLength(1);
      expect(Object.keys(result.createdExercises)).toHaveLength(0);
      expect(Object.keys(result.createdExternalExercises)).toHaveLength(0);
    });

    it("should include existing exercise in allExercises", async () => {
      const existingInfo: CreateExerciseData = {
        externalExerciseId:
          externalExerciseRefTestProps.validExternalExerciseRefProps.externalId,
        source:
          externalExerciseRefTestProps.validExternalExerciseRefProps.source,
        name: "Does not matter",
      };

      const result = await createExercisesAndExternalExercisesNoSaveInRepo(
        [existingInfo],
        exercisesRepo,
        externalExercisesRefRepo,
        idGenerator,
      );

      expect(result.allExercises).toHaveLength(1);
    });
  });

  describe("when mixing existing and new exercises", () => {
    beforeEach(async () => {
      const existingExercise = exerciseTestProps.createTestExercise();

      const existingExternalRef =
        externalExerciseRefTestProps.createTestExternalExerciseRef({
          exerciseId: existingExercise.id,
        });

      await exercisesRepo.saveExercise(existingExercise);
      await externalExercisesRefRepo.save(existingExternalRef);
    });

    it("should create only the missing exercises and keep existing ones", async () => {
      const existingInfo: CreateExerciseData = {
        externalExerciseId:
          externalExerciseRefTestProps.validExternalExerciseRefProps.externalId,

        source:
          externalExerciseRefTestProps.validExternalExerciseRefProps.source,

        name: "Existing exercise",
      };

      const result = await createExercisesAndExternalExercisesNoSaveInRepo(
        [existingInfo, newExerciseInfo],
        exercisesRepo,
        externalExercisesRefRepo,
        idGenerator,
      );

      expect(result.existingExercises).toHaveLength(1);
      expect(result.fetchedExternalExercises).toHaveLength(1);
      expect(Object.keys(result.createdExercises)).toHaveLength(1);
      expect(Object.keys(result.createdExternalExercises)).toHaveLength(1);
      expect(result.allExercises).toHaveLength(2);
    });
  });
});
