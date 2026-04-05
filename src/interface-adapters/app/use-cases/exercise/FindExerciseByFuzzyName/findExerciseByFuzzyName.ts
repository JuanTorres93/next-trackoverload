import { FindExerciseByFuzzyNameUsecase } from "@/application-layer/use-cases/exercise/FindExerciseByFuzzyName/FindExerciseByFuzzyNameUsecase";
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

const exerciseFinder = new WgerExerciseFinder();

const searchRateLimiter = new RateLimiterImpl(
  READ_RATE_LIMITS.searchQueries.requests,
  READ_RATE_LIMITS.searchQueries.perMinutes,
);

export const AppFindExerciseByFuzzyNameUsecase =
  new FindExerciseByFuzzyNameUsecase(exerciseFinder, searchRateLimiter);
