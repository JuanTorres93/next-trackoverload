import { AdapterError } from '@/domain/common/errors';
import { MemoryDaysRepo } from '@/infra/repos/memory/MemoryDaysRepo';
import { MongoDaysRepo } from '@/infra/repos/mongo/MongoDaysRepo';
import { mongooseInitPromise } from './common/initMongoose';

let AppDaysRepo: MemoryDaysRepo | MongoDaysRepo;

if (process.env.NODE_ENV === 'test') {
  AppDaysRepo = new MemoryDaysRepo();
} else if (process.env.NODE_ENV === 'development') {
  // Wait for the joint promise of MongoDB connection
  await mongooseInitPromise;
  AppDaysRepo = new MongoDaysRepo();
}
// TODO implement production
else {
  throw new AdapterError(
    "AppRecipesRepo: NODE_ENV must be one of 'production', 'development', or 'test'",
  );
}

export { AppDaysRepo };
