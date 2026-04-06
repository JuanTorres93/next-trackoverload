import { beforeEach, describe, expect, it } from "vitest";

import {
  ExerciseFinder,
  ExerciseFinderResult,
} from "@/domain/services/ExerciseFinder.port";

import {
  FindExerciseByFuzzyNameRequest,
  FindExerciseByFuzzyNameUsecase,
} from "../FindExerciseByFuzzyNameUsecase";

class MemoryExerciseFinder implements ExerciseFinder {
  private readonly results: ExerciseFinderResult[];

  constructor(results: ExerciseFinderResult[] = []) {
    this.results = results;
  }

  async findExercisesByFuzzyName(): Promise<ExerciseFinderResult[]> {
    return this.results;
  }
}

const sampleResults: ExerciseFinderResult[] = [
  {
    exercise: { name: "Bench Press" },
    externalRef: { externalId: "1", source: "wger" },
  },
  {
    exercise: { name: "Incline Bench Press" },
    externalRef: { externalId: "2", source: "wger" },
  },
];

describe("FindExerciseByFuzzyNameUsecase", () => {
  const CLIENT_ID = "test-client";
  const request: FindExerciseByFuzzyNameRequest = {
    name: "Bench",
    clientId: CLIENT_ID,
  };

  let exerciseFinder: MemoryExerciseFinder;
  let usecase: FindExerciseByFuzzyNameUsecase;

  beforeEach(() => {
    exerciseFinder = new MemoryExerciseFinder(sampleResults);
    usecase = new FindExerciseByFuzzyNameUsecase(exerciseFinder);
  });

  describe("Execution", () => {
    it("returns results from the exercise finder", async () => {
      const results = await usecase.execute(request);

      expect(results).toHaveLength(sampleResults.length);
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
      const emptyFinder = new MemoryExerciseFinder([]);
      const emptyUsecase = new FindExerciseByFuzzyNameUsecase(emptyFinder);

      const results = await emptyUsecase.execute(request);

      expect(results).toHaveLength(0);
    });
  });
});
