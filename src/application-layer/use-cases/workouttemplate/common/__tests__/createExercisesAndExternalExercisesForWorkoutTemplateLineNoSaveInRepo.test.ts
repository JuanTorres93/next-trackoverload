import { beforeEach, describe, expect, it } from "vitest";

import { MemoryExercisesRepo } from "@/infra/repos/memory/MemoryExercisesRepo";
import { MemoryExternalExercisesRefRepo } from "@/infra/repos/memory/MemoryExternalExercisesRefRepo";
import { Uuidv4IdGenerator } from "@/infra/services/IdGenerator/Uuidv4IdGenerator/Uuidv4IdGenerator";

import * as exerciseTestProps from "../../../../../../tests/createProps/exerciseTestProps";
import * as externalExerciseRefTestProps from "../../../../../../tests/createProps/externalExerciseRefTestProps";
import {
  CreateWorkoutTemplateLineData,
  createExercisesAndExternalExercisesForWorkoutTemplateLineNoSaveInRepo,
} from "../createExercisesAndExternalExercisesForWorkoutTemplateLineNoSaveInRepo";

describe("createExercisesAndExternalExercisesForWorkoutTemplateLineNoSaveInRepo", () => {
  let exercisesRepo: MemoryExercisesRepo;
  let externalExercisesRefRepo: MemoryExternalExercisesRefRepo;

  const idGenerator = new Uuidv4IdGenerator();

  const newExerciseLineInfo: CreateWorkoutTemplateLineData = {
    externalExerciseId: "ext-ex-new",
    source: "wger",
    name: "Bench Press",
    sets: 3,
  };

  beforeEach(() => {
    exercisesRepo = new MemoryExercisesRepo();
    externalExercisesRefRepo = new MemoryExternalExercisesRefRepo();
  });

  describe("when the exercise does not exist yet", () => {
    it("should create a new exercise and external exercise ref", async () => {
      const result =
        await createExercisesAndExternalExercisesForWorkoutTemplateLineNoSaveInRepo(
          [newExerciseLineInfo],
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
      const result =
        await createExercisesAndExternalExercisesForWorkoutTemplateLineNoSaveInRepo(
          [newExerciseLineInfo],
          exercisesRepo,
          externalExercisesRefRepo,
          idGenerator,
        );

      const createdExercise =
        result.createdExercises[newExerciseLineInfo.externalExerciseId];
      const createdExternalRef =
        result.createdExternalExercises[newExerciseLineInfo.externalExerciseId];

      expect(createdExercise.id).toBe(createdExternalRef.exerciseId);
      expect(createdExercise.name).toBe(newExerciseLineInfo.name);
      expect(createdExternalRef.externalId).toBe(
        newExerciseLineInfo.externalExerciseId,
      );
      expect(createdExternalRef.source).toBe(newExerciseLineInfo.source);
    });

    it("should populate setsMapByExternalId for the created exercise", async () => {
      const result =
        await createExercisesAndExternalExercisesForWorkoutTemplateLineNoSaveInRepo(
          [newExerciseLineInfo],
          exercisesRepo,
          externalExercisesRefRepo,
          idGenerator,
        );

      const entry =
        result.setsMapByExternalId[newExerciseLineInfo.externalExerciseId];

      expect(entry).toBeDefined();
      expect(entry.sets).toBe(newExerciseLineInfo.sets);
    });

    it("should include the created exercise in allExercises", async () => {
      const result =
        await createExercisesAndExternalExercisesForWorkoutTemplateLineNoSaveInRepo(
          [newExerciseLineInfo],
          exercisesRepo,
          externalExercisesRefRepo,
          idGenerator,
        );

      expect(result.allExercises).toHaveLength(1);
      expect(result.allExercises[0].name).toBe(newExerciseLineInfo.name);
    });

    it("should create multiple new exercises when none exist", async () => {
      const secondExerciseLineInfo: CreateWorkoutTemplateLineData = {
        externalExerciseId: "ext-ex-new-2",
        source: "wger",
        name: "Squat",
        sets: 4,
      };

      const result =
        await createExercisesAndExternalExercisesForWorkoutTemplateLineNoSaveInRepo(
          [newExerciseLineInfo, secondExerciseLineInfo],
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
      const existingInfo: CreateWorkoutTemplateLineData = {
        externalExerciseId:
          externalExerciseRefTestProps.validExternalExerciseRefProps.externalId,

        source:
          externalExerciseRefTestProps.validExternalExerciseRefProps.source,

        name: "Does not matter",
        sets: 3,
      };

      const result =
        await createExercisesAndExternalExercisesForWorkoutTemplateLineNoSaveInRepo(
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

    it("should populate setsMapByExternalId for the existing exercise", async () => {
      const existingInfo: CreateWorkoutTemplateLineData = {
        externalExerciseId:
          externalExerciseRefTestProps.validExternalExerciseRefProps.externalId,

        source:
          externalExerciseRefTestProps.validExternalExerciseRefProps.source,

        name: "Does not matter",
        sets: 5,
      };

      const result =
        await createExercisesAndExternalExercisesForWorkoutTemplateLineNoSaveInRepo(
          [existingInfo],
          exercisesRepo,
          externalExercisesRefRepo,
          idGenerator,
        );

      const entry = result.setsMapByExternalId[existingInfo.externalExerciseId];

      expect(entry).toBeDefined();
      expect(entry.sets).toBe(5);
    });

    it("should include existing exercise in allExercises", async () => {
      const existingInfo: CreateWorkoutTemplateLineData = {
        externalExerciseId:
          externalExerciseRefTestProps.validExternalExerciseRefProps.externalId,

        source:
          externalExerciseRefTestProps.validExternalExerciseRefProps.source,

        name: "Does not matter",
        sets: 3,
      };

      const result =
        await createExercisesAndExternalExercisesForWorkoutTemplateLineNoSaveInRepo(
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
      const existingInfo: CreateWorkoutTemplateLineData = {
        externalExerciseId:
          externalExerciseRefTestProps.validExternalExerciseRefProps.externalId,

        source:
          externalExerciseRefTestProps.validExternalExerciseRefProps.source,

        name: "Existing exercise",
        sets: 3,
      };

      const result =
        await createExercisesAndExternalExercisesForWorkoutTemplateLineNoSaveInRepo(
          [existingInfo, newExerciseLineInfo],
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

    it("should populate setsMapByExternalId for both existing and new exercises", async () => {
      const existingInfo: CreateWorkoutTemplateLineData = {
        externalExerciseId:
          externalExerciseRefTestProps.validExternalExerciseRefProps.externalId,

        source:
          externalExerciseRefTestProps.validExternalExerciseRefProps.source,

        name: "Existing exercise",
        sets: 2,
      };

      const result =
        await createExercisesAndExternalExercisesForWorkoutTemplateLineNoSaveInRepo(
          [existingInfo, newExerciseLineInfo],
          exercisesRepo,
          externalExercisesRefRepo,
          idGenerator,
        );

      expect(
        result.setsMapByExternalId[existingInfo.externalExerciseId].sets,
      ).toBe(2);
      expect(
        result.setsMapByExternalId[newExerciseLineInfo.externalExerciseId].sets,
      ).toBe(newExerciseLineInfo.sets);
    });
  });
});
