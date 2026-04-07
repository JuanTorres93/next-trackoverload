import { beforeEach, describe, expect, it } from "vitest";

import { mockExercisesForExerciseFinder } from "@/../tests/mocks/exercises";
import { MemoryExerciseFinder } from "@/infra/services/ExerciseFinder/MemoryExerciseFinder/MemoryExerciseFinder";

import {
  FindExerciseByFuzzyNameRequest,
  FindExerciseByFuzzyNameUsecase,
} from "../FindExerciseByFuzzyNameUsecase";

describe("FindExerciseByFuzzyNameUsecase", () => {
  const CLIENT_ID = "test-client";
  const request: FindExerciseByFuzzyNameRequest = {
    name: "Bench",
    clientId: CLIENT_ID,
  };

  let usecase: FindExerciseByFuzzyNameUsecase;

  beforeEach(() => {
    usecase = new FindExerciseByFuzzyNameUsecase(
      new MemoryExerciseFinder(mockExercisesForExerciseFinder),
    );
  });

  describe("Execution", () => {
    it("returns results from the exercise finder", async () => {
      const results = await usecase.execute(request);

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].exercise.name).toBe("Bench Press");
    });

    it("each result has exercise and externalRef properties", async () => {
      const results = await usecase.execute(request);

      for (const result of results) {
        expect(result).toHaveProperty("exercise");
        expect(result).toHaveProperty("externalRef");
      }
    });

    it("returns empty array when no exercises match", async () => {
      const emptyUsecase = new FindExerciseByFuzzyNameUsecase(
        new MemoryExerciseFinder([]),
      );

      const results = await emptyUsecase.execute(request);

      expect(results).toHaveLength(0);
    });
  });
});
