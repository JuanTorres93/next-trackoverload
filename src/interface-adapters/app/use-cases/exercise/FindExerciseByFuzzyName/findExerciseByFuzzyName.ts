import { FindExerciseByFuzzyNameUsecase } from "@/application-layer/use-cases/exercise/FindExerciseByFuzzyName/FindExerciseByFuzzyNameUsecase";
import { MemoryExerciseFinder } from "@/infra/services/ExerciseFinder/MemoryExerciseFinder/MemoryExerciseFinder";
import {
  READ_RATE_LIMITS,
  WgerExerciseFinder,
} from "@/infra/services/ExerciseFinder/WgerExerciseFinder/WgerExerciseFinder";
import { BottleneckRateLimiter } from "@/infra/services/RateLimiter/BottleneckRateLimiter/BottleneckRateLimiter";
import { MemoryTokenBucketRateLimiter } from "@/infra/services/RateLimiter/MemoryTokenBucketRateLimiter/MemoryTokenBucketRateLimiter";

const RateLimiterImpl =
  process.env.NODE_ENV === "test"
    ? MemoryTokenBucketRateLimiter
    : BottleneckRateLimiter;

const searchRateLimiter = new RateLimiterImpl(
  READ_RATE_LIMITS.searchQueries.requests,
  READ_RATE_LIMITS.searchQueries.perMinutes,
);

export function createAppFindExerciseByFuzzyNameUsecase(
  clientId: string,
): FindExerciseByFuzzyNameUsecase {
  const exerciseFinder =
    process.env.NODE_ENV === "test"
      ? new MemoryExerciseFinder()
      : new WgerExerciseFinder(searchRateLimiter, clientId);

  return new FindExerciseByFuzzyNameUsecase(exerciseFinder);
}
