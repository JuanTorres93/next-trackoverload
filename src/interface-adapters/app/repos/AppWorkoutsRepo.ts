import { AdapterError } from '@/domain/common/errors';
import { MemoryWorkoutsRepo } from '@/infra/repos/memory/MemoryWorkoutsRepo';
import { MongoWorkoutsRepo } from '@/infra/repos/mongo/MongoWorkoutsRepo';
import { mongooseInitPromise } from './common/initMongoose';

let AppWorkoutsRepo: MemoryWorkoutsRepo | MongoWorkoutsRepo;

if (process.env.NODE_ENV === 'test') {
  AppWorkoutsRepo = new MemoryWorkoutsRepo();
} else if (
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === 'production'
) {
  await mongooseInitPromise;
  AppWorkoutsRepo = new MongoWorkoutsRepo();
} else {
  throw new AdapterError(
    "AppWorkoutsRepo: NODE_ENV must be one of 'production', 'development', or 'test'",
  );
}

export { AppWorkoutsRepo };
