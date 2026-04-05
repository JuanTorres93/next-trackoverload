import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { ExternalExerciseRef } from "@/domain/entities/externalexerciseref/ExternalExerciseRef";

import * as externalExerciseRefTestProps from "../../../../../tests/createProps/externalExerciseRefTestProps";
import { MongoExternalExercisesRefRepo } from "../MongoExternalExercisesRefRepo";
import {
  clearMongoTestDB,
  setupMongoTestDB,
  teardownMongoTestDB,
} from "./setupMongoTestDB";

describe("MongoExternalExercisesRefRepo", () => {
  let repo: MongoExternalExercisesRefRepo;
  let externalExerciseRef: ExternalExerciseRef;

  beforeAll(async () => {
    await setupMongoTestDB();
  });

  beforeEach(async () => {
    await clearMongoTestDB();

    repo = new MongoExternalExercisesRefRepo();

    externalExerciseRef =
      externalExerciseRefTestProps.createTestExternalExerciseRef();

    await repo.save(externalExerciseRef);
  });

  afterAll(async () => {
    await teardownMongoTestDB();
  });

  it("should save an external exercise ref", async () => {
    const newExternalExerciseRef =
      externalExerciseRefTestProps.createTestExternalExerciseRef({
        externalId: "ext-ex-2",
        exerciseId: "exercise-id-2",
      });

    await repo.save(newExternalExerciseRef);

    const fetched = await repo.getByExternalIdAndSource("ext-ex-2", "wger");
    expect(fetched).not.toBeNull();
    expect(fetched!.externalId).toBe("ext-ex-2");
  });

  it("should update an existing external exercise ref", async () => {
    const updatedRef =
      externalExerciseRefTestProps.createTestExternalExerciseRef({
        exerciseId: "new-exercise-id",
      });

    await repo.save(updatedRef);

    const fetched = await repo.getByExternalIdAndSource(
      externalExerciseRef.externalId,
      externalExerciseRef.source,
    );

    expect(fetched).not.toBeNull();
    expect(fetched!.exerciseId).toBe("new-exercise-id");
  });

  it("should retrieve an external exercise ref by external ID and source", async () => {
    const fetched = await repo.getByExternalIdAndSource(
      externalExerciseRef.externalId,
      externalExerciseRef.source,
    );

    expect(fetched).not.toBeNull();
    expect(fetched!.externalId).toBe(externalExerciseRef.externalId);
    expect(fetched!.source).toBe(externalExerciseRef.source);
    expect(fetched!.exerciseId).toBe(externalExerciseRef.exerciseId);
  });

  it("should return null for non-existent external exercise ref", async () => {
    const fetched = await repo.getByExternalIdAndSource(
      "non-existent-id",
      "wger",
    );

    expect(fetched).toBeNull();
  });

  describe("getByExternalIdsAndSource", () => {
    beforeEach(async () => {
      await clearMongoTestDB();
      repo = new MongoExternalExercisesRefRepo();

      const refs = [
        externalExerciseRefTestProps.createTestExternalExerciseRef({
          externalId: "ext-id-1",
          exerciseId: "ex-id-1",
        }),
        externalExerciseRefTestProps.createTestExternalExerciseRef({
          externalId: "ext-id-2",
          exerciseId: "ex-id-2",
        }),
        externalExerciseRefTestProps.createTestExternalExerciseRef({
          externalId: "ext-id-3",
          exerciseId: "ex-id-3",
        }),
      ];

      for (const ref of refs) {
        await repo.save(ref);
      }
    });

    it("should retrieve multiple external exercise refs by their external IDs", async () => {
      const refs = await repo.getByExternalIdsAndSource(
        ["ext-id-1", "ext-id-3"],
        "wger",
      );

      expect(refs).toHaveLength(2);
      expect(refs.map((r) => r.externalId)).toContain("ext-id-1");
      expect(refs.map((r) => r.externalId)).toContain("ext-id-3");
    });

    it("should retrieve single external exercise ref when only one ID is provided", async () => {
      const refs = await repo.getByExternalIdsAndSource(["ext-id-2"], "wger");

      expect(refs).toHaveLength(1);
      expect(refs[0].externalId).toBe("ext-id-2");
      expect(refs[0].exerciseId).toBe("ex-id-2");
    });

    it("should return empty array when provided IDs do not exist", async () => {
      const refs = await repo.getByExternalIdsAndSource(
        ["non-existent-1", "non-existent-2"],
        "wger",
      );

      expect(refs).toHaveLength(0);
    });

    it("should return empty array when provided with empty array", async () => {
      const refs = await repo.getByExternalIdsAndSource([], "wger");

      expect(refs).toHaveLength(0);
    });

    it("should filter out non-existent IDs and return only existing ones", async () => {
      const refs = await repo.getByExternalIdsAndSource(
        ["ext-id-1", "non-existent", "ext-id-2"],
        "wger",
      );

      expect(refs).toHaveLength(2);
      expect(refs.map((r) => r.externalId)).toContain("ext-id-1");
      expect(refs.map((r) => r.externalId)).toContain("ext-id-2");
    });

    it("should retrieve all external exercise refs when all IDs are provided", async () => {
      const refs = await repo.getByExternalIdsAndSource(
        ["ext-id-1", "ext-id-2", "ext-id-3"],
        "wger",
      );

      expect(refs).toHaveLength(3);
    });

    it("should only return refs matching the specified source", async () => {
      const refs = await repo.getByExternalIdsAndSource(
        ["ext-id-1", "ext-id-2"],
        "wger",
      );

      expect(refs).toHaveLength(2);
      refs.forEach((ref) => {
        expect(ref.source).toBe("wger");
      });
    });
  });

  describe("getAllExternalExercisesRef", () => {
    it("should return all external exercise refs", async () => {
      await clearMongoTestDB();

      const refs = [
        externalExerciseRefTestProps.createTestExternalExerciseRef({
          externalId: "ext-id-1",
          exerciseId: "ex-id-1",
        }),
        externalExerciseRefTestProps.createTestExternalExerciseRef({
          externalId: "ext-id-2",
          exerciseId: "ex-id-2",
        }),
        externalExerciseRefTestProps.createTestExternalExerciseRef({
          externalId: "ext-id-3",
          exerciseId: "ex-id-3",
        }),
      ];

      for (const ref of refs) {
        await repo.save(ref);
      }

      const all = await repo.getAllExternalExercisesRef();
      expect(all).toHaveLength(3);
    });

    it("should return empty array when no refs exist", async () => {
      await clearMongoTestDB();

      const all = await repo.getAllExternalExercisesRef();
      expect(all).toHaveLength(0);
    });
  });

  describe("delete", () => {
    it("should delete an existing external exercise ref", async () => {
      await repo.delete(externalExerciseRef.externalId);

      const fetched = await repo.getByExternalIdAndSource(
        externalExerciseRef.externalId,
        externalExerciseRef.source,
      );
      expect(fetched).toBeNull();
    });

    it("should reject when deleting a non-existent external exercise ref", async () => {
      await expect(repo.delete("non-existent-id")).rejects.toBeNull();
    });
  });
});
