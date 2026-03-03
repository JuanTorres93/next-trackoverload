import { OpenFoodFactsIngredientFinder } from '@/infra/services/IngredientsFinder/OpenFoodFactsIngredientFinder/OpenFoodFactsIngredientFinder';

import { MemoryTokenBucketRateLimiter } from '@/infra/services/RateLimiter/MemoryTokenBucketRateLimiter/MemoryTokenBucketRateLimiter';
import { BottleneckRateLimiter } from '@/infra/services/RateLimiter/BottleneckRateLimiter/BottleneckRateLimiter';
import { IngredientFinder } from '@/domain/services/IngredientFinder.port';

let AppIngredientFinder: IngredientFinder;

if (process.env.NODE_ENV === 'test') {
  AppIngredientFinder = new OpenFoodFactsIngredientFinder(
    MemoryTokenBucketRateLimiter,
  );
} else {
  AppIngredientFinder = new OpenFoodFactsIngredientFinder(
    BottleneckRateLimiter,
  );
}

export { AppIngredientFinder };
