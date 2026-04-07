import { mockExercisesForExerciseFinder } from "@/../tests/mocks/exercises";

import MemoryExerciseFinder from "../MemoryExerciseFinder";

describe("MemoryExerciseFinder", () => {
  let exerciseFinder: MemoryExerciseFinder;

  beforeAll(() => {
    exerciseFinder = new MemoryExerciseFinder(mockExercisesForExerciseFinder);
  });

  describe("findExercisesByFuzzyName", () => {
    it("returns results for partial name matches", async () => {
      const results = await exerciseFinder.findExercisesByFuzzyName("Bench");

      expect(results.length).toBeGreaterThan(0);
      for (const r of results) {
        expect(r).toHaveProperty("exercise");
        expect(r).toHaveProperty("externalRef");
      }
    });

    it("is case-insensitive", async () => {
      const lower = await exerciseFinder.findExercisesByFuzzyName("bench");
      const upper = await exerciseFinder.findExercisesByFuzzyName("BENCH");

      expect(lower.length).toBeGreaterThan(0);
      expect(upper.length).toBe(lower.length);
    });

    it("returns empty array for empty term", async () => {
      const results = await exerciseFinder.findExercisesByFuzzyName("");

      expect(results).toHaveLength(0);
    });

    it("returns empty array when no exercise name matches", async () => {
      const results =
        await exerciseFinder.findExercisesByFuzzyName("XYZ_NO_MATCH");

      expect(results).toHaveLength(0);
    });
  });
});
