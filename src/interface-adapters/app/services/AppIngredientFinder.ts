import { IngredientFinder } from "@/domain/services/IngredientFinder.port";
import { RateLimiter } from "@/domain/services/RateLimiter.port";
import {
  OpenFoodFactsIngredientFinder,
  READ_RATE_LIMITS,
} from "@/infra/services/IngredientsFinder/OpenFoodFactsIngredientFinder/OpenFoodFactsIngredientFinder";
import { BottleneckRateLimiter } from "@/infra/services/RateLimiter/BottleneckRateLimiter/BottleneckRateLimiter";
import { MemoryTokenBucketRateLimiter } from "@/infra/services/RateLimiter/MemoryTokenBucketRateLimiter/MemoryTokenBucketRateLimiter";

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
  return new OpenFoodFactsIngredientFinder(
    searchRateLimiter,
    barcodeRateLimiter,
    clientId,
  );
}
