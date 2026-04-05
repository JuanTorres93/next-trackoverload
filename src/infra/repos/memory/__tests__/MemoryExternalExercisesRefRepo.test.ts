import { beforeEach, describe, expect, it } from "vitest";

import { ExternalExerciseRef } from "@/domain/entities/externalexerciseref/ExternalExerciseRef";

import { createTestExternalExerciseRef } from "../../../../../tests/createProps/externalExerciseRefTestProps";
import { MemoryExternalExercisesRefRepo } from "../MemoryExternalExercisesRefRepo";

describe("MemoryExternalExercisesRefRepo", () => {
  let repo: MemoryExternalExercisesRefRepo;
  let externalExerciseRef: ExternalExerciseRef;

  beforeEach(async () => {
    repo = new MemoryExternalExercisesRefRepo();

    externalExerciseRef = createTestExternalExerciseRef();

    await repo.save(externalExerciseRef);
  });

  describe("save", () => {
    it("should save an external exercise ref", async () => {
      const allRefs = repo.getAllForTesting();

      expect(allRefs.length).toBe(1);
    });

    it("should update an existing external exercise ref", async () => {
      const updatedRef = createTestExternalExerciseRef({
        exerciseId: "updated-ex",
      });

      await repo.save(updatedRef);

      const allRefs = repo.getAllForTesting();

      expect(allRefs.length).toBe(1);
      expect(allRefs[0].exerciseId).toBe("updated-ex");
    });
  });

  describe("getByExternalIdAndSource", () => {
    it("should retrieve an external exercise ref by externalId and source", async () => {
      const fetched = await repo.getByExternalIdAndSource(
        externalExerciseRef.externalId,
        externalExerciseRef.source,
      );

      expect(fetched).not.toBeNull();
      expect(fetched!.externalId).toBe(externalExerciseRef.externalId);
      expect(fetched!.source).toBe(externalExerciseRef.source);
    });

    it("should return null for non-existent external exercise ref", async () => {
      const fetched = await repo.getByExternalIdAndSource(
        "non-existent",
        "NonExistentSource",
      );
      expect(fetched).toBeNull();
    });

    it("should return null if externalId matches but source does not", async () => {
      const fetched = await repo.getByExternalIdAndSource(
        externalExerciseRef.externalId,
        "DifferentSource",
      );
      expect(fetched).toBeNull();
    });

    it("should return null if source matches but externalId does not", async () => {
      const fetched = await repo.getByExternalIdAndSource(
        "different-id",
        externalExerciseRef.source,
      );
      expect(fetched).toBeNull();
    });
  });

  describe("getByExternalIdsAndSource", () => {
    it("should retrieve multiple external exercise refs by externalIds and source", async () => {
      const ref2 = createTestExternalExerciseRef({
        externalId: "ext-id-2",
        exerciseId: "ex-id-2",
      });

      const ref3 = createTestExternalExerciseRef({
        externalId: "ext-id-3",
        exerciseId: "ex-id-3",
      });

      await repo.save(ref2);
      await repo.save(ref3);

      const fetched = await repo.getByExternalIdsAndSource(
        [externalExerciseRef.externalId, "ext-id-2", "ext-id-3"],
        externalExerciseRef.source,
      );

      expect(fetched.length).toBe(3);
      expect(fetched.map((r) => r.externalId)).toContain(
        externalExerciseRef.externalId,
      );
      expect(fetched.map((r) => r.externalId)).toContain("ext-id-2");
      expect(fetched.map((r) => r.externalId)).toContain("ext-id-3");
    });

    it("should return empty array when no external exercise refs match", async () => {
      const fetched = await repo.getByExternalIdsAndSource(
        ["non-existent-1", "non-existent-2"],
        externalExerciseRef.source,
      );

      expect(fetched).toEqual([]);
    });

    it("should return only matching refs when some externalIds do not exist", async () => {
      const fetched = await repo.getByExternalIdsAndSource(
        [externalExerciseRef.externalId, "non-existent-id"],
        externalExerciseRef.source,
      );

      expect(fetched.length).toBe(1);
      expect(fetched[0].externalId).toBe(externalExerciseRef.externalId);
    });

    it("should return empty array when source does not match", async () => {
      const fetched = await repo.getByExternalIdsAndSource(
        [externalExerciseRef.externalId],
        "DifferentSource",
      );

      expect(fetched).toEqual([]);
    });

    it("should return empty array for empty externalIds array", async () => {
      const fetched = await repo.getByExternalIdsAndSource(
        [],
        externalExerciseRef.source,
      );

      expect(fetched).toEqual([]);
    });
  });

  describe("getAllExternalExercisesRef", () => {
    it("should return all external exercise refs", async () => {
      const ref2 = createTestExternalExerciseRef({
        externalId: "ext-id-2",
        exerciseId: "ex-id-2",
      });

      const ref3 = createTestExternalExerciseRef({
        externalId: "ext-id-3",
        exerciseId: "ex-id-3",
      });

      await repo.save(ref2);
      await repo.save(ref3);

      const allRefs = await repo.getAllExternalExercisesRef();

      expect(allRefs.length).toBe(3);
      expect(allRefs.map((r) => r.externalId)).toContain(
        externalExerciseRef.externalId,
      );
      expect(allRefs.map((r) => r.externalId)).toContain("ext-id-2");
      expect(allRefs.map((r) => r.externalId)).toContain("ext-id-3");
    });

    it("should return empty array when no refs exist", async () => {
      repo.clearForTesting();

      const allRefs = await repo.getAllExternalExercisesRef();

      expect(allRefs.length).toBe(0);
    });

    it("should return a copy of the array (not modify original)", async () => {
      const allRefs = await repo.getAllExternalExercisesRef();
      allRefs.push(
        createTestExternalExerciseRef({
          externalId: "should-not-be-saved",
        }),
      );

      const allRefsAgain = await repo.getAllExternalExercisesRef();
      expect(allRefsAgain.length).toBe(1);
    });
  });

  describe("delete", () => {
    it("should delete an external exercise ref by externalId", async () => {
      await repo.delete(externalExerciseRef.externalId);

      const allRefs = repo.getAllForTesting();
      expect(allRefs.length).toBe(0);
    });

    it("should handle deletion of non-existent externalId gracefully", async () => {
      await expect(repo.delete("non-existent-id")).rejects.toBeNull();
    });
  });
});
