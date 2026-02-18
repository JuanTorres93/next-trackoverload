import { AdapterError } from '@/domain/common/errors';
import { MemoryExercisesRepo } from '@/infra/repos/memory/MemoryExercisesRepo';
import { MongoExercisesRepo } from '@/infra/repos/mongo/MongoExercisesRepo';
import { mongooseInitPromise } from './common/initMongoose';

let AppExercisesRepo: MemoryExercisesRepo | MongoExercisesRepo;

if (process.env.NODE_ENV === 'test') {
  AppExercisesRepo = new MemoryExercisesRepo();
} else if (
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === 'production'
) {
  await mongooseInitPromise;
  AppExercisesRepo = new MongoExercisesRepo();
} else {
  throw new AdapterError(
    "AppExercisesRepo: NODE_ENV must be one of 'production', 'development', or 'test'",
  );
}

export { AppExercisesRepo };
