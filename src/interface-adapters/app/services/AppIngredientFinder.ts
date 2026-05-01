import { IngredientFinder } from "@/domain/services/IngredientFinder.port";
import { MemoryIngredientFinder } from "@/infra/services/IngredientsFinder/MemoryIngredientFinder/MemoryIngredientFinder";
import {
  OpenFoodFactsIngredientFinder,
  READ_RATE_LIMITS,
} from "@/infra/services/IngredientsFinder/OpenFoodFactsIngredientFinder/OpenFoodFactsIngredientFinder";
import { BottleneckRateLimiter } from "@/infra/services/RateLimiter/BottleneckRateLimiter/BottleneckRateLimiter";
import { MemoryTokenBucketRateLimiter } from "@/infra/services/RateLimiter/MemoryTokenBucketRateLimiter/MemoryTokenBucketRateLimiter";
import { RateLimiter } from "@/infra/services/interfaces/RateLimiter.port";

const RateLimiterImpl =
  process.env.NODE_ENV === "test"
    ? MemoryTokenBucketRateLimiter
    : BottleneckRateLimiter;

const searchRateLimiter: RateLimiter = new RateLimiterImpl(
  READ_RATE_LIMITS.searchQueries.requests,
  READ_RATE_LIMITS.searchQueries.perMinutes,
);

const barcodeRateLimiter: RateLimiter = new RateLimiterImpl(
  READ_RATE_LIMITS.productQueries.requests,
  READ_RATE_LIMITS.productQueries.perMinutes,
);

export function createAppIngredientFinder(clientId: string): IngredientFinder {
  if (process.env.NODE_ENV === "test") {
    return new MemoryIngredientFinder();
  }

  return new OpenFoodFactsIngredientFinder(
    searchRateLimiter,
    barcodeRateLimiter,
    clientId,
  );
}
