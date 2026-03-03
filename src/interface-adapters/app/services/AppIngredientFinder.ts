import {
  OpenFoodFactsIngredientFinder,
  READ_RATE_LIMITS,
} from '@/infra/services/IngredientsFinder/OpenFoodFactsIngredientFinder/OpenFoodFactsIngredientFinder';
import { MemoryTokenBucketRateLimiter } from '@/infra/services/RateLimiter/MemoryTokenBucketRateLimiter/MemoryTokenBucketRateLimiter';
import { BottleneckRateLimiter } from '@/infra/services/RateLimiter/BottleneckRateLimiter/BottleneckRateLimiter';
import { IngredientFinder } from '@/domain/services/IngredientFinder.port';
import { RateLimiter } from '@/domain/services/RateLimiter.port';

const RateLimiterImpl =
  process.env.NODE_ENV === 'test'
    ? MemoryTokenBucketRateLimiter
    : BottleneckRateLimiter;

const sharedSearchRateLimiter: RateLimiter = new RateLimiterImpl(
  READ_RATE_LIMITS.searchQueries.requests,
  READ_RATE_LIMITS.searchQueries.perMinutes,
);

const sharedBarcodeRateLimiter: RateLimiter = new RateLimiterImpl(
  READ_RATE_LIMITS.productQueries.requests,
  READ_RATE_LIMITS.productQueries.perMinutes,
);

export function createAppIngredientFinder(clientId: string): IngredientFinder {
  return new OpenFoodFactsIngredientFinder(
    sharedSearchRateLimiter,
    sharedBarcodeRateLimiter,
    clientId,
  );
}
