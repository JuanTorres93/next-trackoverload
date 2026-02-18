import { AdapterError } from '@/domain/common/errors';
import { MemoryWorkoutTemplatesRepo } from '@/infra/repos/memory/MemoryWorkoutTemplatesRepo';
import { MongoWorkoutTemplatesRepo } from '@/infra/repos/mongo/MongoWorkoutTemplatesRepo';
import { mongooseInitPromise } from './common/initMongoose';

let AppWorkoutsTemplatesRepo:
  | MemoryWorkoutTemplatesRepo
  | MongoWorkoutTemplatesRepo;

if (process.env.NODE_ENV === 'test') {
  AppWorkoutsTemplatesRepo = new MemoryWorkoutTemplatesRepo();
} else if (
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === 'production'
) {
  await mongooseInitPromise;
  AppWorkoutsTemplatesRepo = new MongoWorkoutTemplatesRepo();
} else {
  throw new AdapterError(
    "AppWorkoutsTemplatesRepo: NODE_ENV must be one of 'production', 'development', or 'test'",
  );
}

export { AppWorkoutsTemplatesRepo };
