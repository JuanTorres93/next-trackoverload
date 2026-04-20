import { ExerciseFinderResult } from "@/domain/services/ExerciseFinder.port";
import { MemoryTokenBucketRateLimiter } from "@/infra/services/RateLimiter/MemoryTokenBucketRateLimiter/MemoryTokenBucketRateLimiter";

import { READ_RATE_LIMITS, WgerExerciseFinder } from "../WgerExerciseFinder";

describe("WgerExerciseFinder", () => {
  let exerciseFinder: WgerExerciseFinder;

  beforeAll(() => {
    const searchRateLimiter = new MemoryTokenBucketRateLimiter(
      READ_RATE_LIMITS.searchQueries.requests,
      READ_RATE_LIMITS.searchQueries.perMinutes,
    );

    exerciseFinder = new WgerExerciseFinder(searchRateLimiter, "test-client");
  });

  // TODO IMPORTANT Uncomment
  //describe("findExercisesByFuzzyName", () => {
  //  let results: ExerciseFinderResult[];

  //  beforeAll(async () => {
  //    results = await exerciseFinder.findExercisesByFuzzyName("Bench Press");
  //  });

  //  it("returns results", () => {
  //    expect(results.length).toBeGreaterThan(0);
  //  });

  //  it("each result has exercise and externalRef", () => {
  //    for (const result of results) {
  //      expect(result).toHaveProperty("exercise");
  //      expect(result).toHaveProperty("externalRef");
  //    }
  //  });

  //  it("exercise has correct properties", () => {
  //    const { exercise } = results[0];
  //    expect(exercise).toHaveProperty("name");
  //    expect(typeof exercise.name).toBe("string");
  //    expect(exercise.name.length).toBeGreaterThan(0);
  //  });

  //  it("externalRef has correct properties", () => {
  //    const { externalRef } = results[0];
  //    expect(externalRef).toHaveProperty("externalId");
  //    expect(typeof externalRef.externalId).toBe("string");
  //    expect(externalRef.externalId.length).toBeGreaterThan(0);

  //    expect(externalRef).toHaveProperty("source");
  //    expect(externalRef.source).toBe("wger");
  //  });

  //  it("deduplicates results by base_id", () => {
  //    const ids = results.map((r) => r.externalRef.externalId);
  //    const uniqueIds = new Set(ids);
  //    expect(ids.length).toBe(uniqueIds.size);
  //  });

  //  it("ranks exact match first", async () => {
  //    const exactResults =
  //      await exerciseFinder.findExercisesByFuzzyName("Bench Press");
  //    expect(exactResults[0].exercise.name.toLowerCase()).toBe("bench press");
  //  });
  //});

  describe("rate limiting", () => {
    it("throws InfrastructureError when rate limit is exceeded", async () => {
      const exhaustedLimiter = new MemoryTokenBucketRateLimiter(0, 1);
      const limitedFinder = new WgerExerciseFinder(
        exhaustedLimiter,
        "limited-client",
      );

      await expect(
        limitedFinder.findExercisesByFuzzyName("Squat"),
      ).rejects.toThrow("Rate limit exceeded");
    });
  });
});
