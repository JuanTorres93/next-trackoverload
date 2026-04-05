import { beforeEach, describe, expect, it } from "vitest";

import { RateLimitError } from "@/domain/common/errors";
import {
  ExerciseFinder,
  ExerciseFinderResult,
} from "@/domain/services/ExerciseFinder.port";
import { MemoryTokenBucketRateLimiter } from "@/infra/services/RateLimiter/MemoryTokenBucketRateLimiter/MemoryTokenBucketRateLimiter";

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
  let rateLimiter: MemoryTokenBucketRateLimiter;
  let usecase: FindExerciseByFuzzyNameUsecase;

  beforeEach(() => {
    exerciseFinder = new MemoryExerciseFinder(sampleResults);
    rateLimiter = new MemoryTokenBucketRateLimiter(10, 1);
    usecase = new FindExerciseByFuzzyNameUsecase(exerciseFinder, rateLimiter);
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
      const emptyUsecase = new FindExerciseByFuzzyNameUsecase(
        emptyFinder,
        rateLimiter,
      );

      const results = await emptyUsecase.execute(request);

      expect(results).toHaveLength(0);
    });

    it("records the request after a successful call", async () => {
      const limitedRateLimiter = new MemoryTokenBucketRateLimiter(1, 1);
      const limitedUsecase = new FindExerciseByFuzzyNameUsecase(
        exerciseFinder,
        limitedRateLimiter,
      );

      await limitedUsecase.execute(request);

      expect(await limitedRateLimiter.isRateLimited(CLIENT_ID)).toBe(true);
    });
  });

  describe("Rate limiting", () => {
    it("throws RateLimitError when the client has exceeded their limit", async () => {
      const exhaustedRateLimiter = new MemoryTokenBucketRateLimiter(0, 1);
      const limitedUsecase = new FindExerciseByFuzzyNameUsecase(
        exerciseFinder,
        exhaustedRateLimiter,
      );

      await expect(limitedUsecase.execute(request)).rejects.toThrow(
        RateLimitError,
      );
    });

    it("tracks rate limits independently per client", async () => {
      const singleRequestLimiter = new MemoryTokenBucketRateLimiter(1, 1);
      const multiClientUsecase = new FindExerciseByFuzzyNameUsecase(
        exerciseFinder,
        singleRequestLimiter,
      );

      await multiClientUsecase.execute({ name: "Bench", clientId: "client-a" });

      await expect(
        multiClientUsecase.execute({ name: "Bench", clientId: "client-a" }),
      ).rejects.toThrow(RateLimitError);

      await expect(
        multiClientUsecase.execute({ name: "Bench", clientId: "client-b" }),
      ).resolves.toBeDefined();
    });

    it("allows other clients to exceed the limit of a blocked client combined", async () => {
      const maxPerClient = 3;
      const sharedLimiter = new MemoryTokenBucketRateLimiter(maxPerClient, 1);
      const multiClientUsecase = new FindExerciseByFuzzyNameUsecase(
        exerciseFinder,
        sharedLimiter,
      );

      // client-a exhausts their quota
      for (let i = 0; i < maxPerClient; i++) {
        await multiClientUsecase.execute({
          name: "Bench",
          clientId: "client-a",
        });
      }
      await expect(
        multiClientUsecase.execute({ name: "Bench", clientId: "client-a" }),
      ).rejects.toThrow(RateLimitError);

      // client-b and client-c can still make maxPerClient requests each,
      // totalling 2x the individual limit — proving isolation
      for (let i = 0; i < maxPerClient; i++) {
        await expect(
          multiClientUsecase.execute({ name: "Bench", clientId: "client-b" }),
        ).resolves.toBeDefined();
        await expect(
          multiClientUsecase.execute({ name: "Bench", clientId: "client-c" }),
        ).resolves.toBeDefined();
      }
    });
  });
});
