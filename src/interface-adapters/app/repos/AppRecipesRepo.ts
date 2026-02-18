import { AdapterError } from '@/domain/common/errors';
import { MemoryRecipesRepo } from '@/infra/repos/memory/MemoryRecipesRepo';
import { MongoRecipesRepo } from '@/infra/repos/mongo/MongoRecipesRepo';
import { mongooseInitPromise } from './common/initMongoose';

let AppRecipesRepo: MemoryRecipesRepo | MongoRecipesRepo;

if (process.env.NODE_ENV === 'test') {
  AppRecipesRepo = new MemoryRecipesRepo();
} else if (
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === 'production'
) {
  await mongooseInitPromise;
  AppRecipesRepo = new MongoRecipesRepo();
} else {
  throw new AdapterError(
    "AppRecipesRepo: NODE_ENV must be one of 'production', 'development', or 'test'",
  );
}

export { AppRecipesRepo };
