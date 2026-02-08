import { AdapterError } from '@/domain/common/errors';
import { MemoryExercisesRepo } from '@/infra/repos/memory/MemoryExercisesRepo';
import { MongoExercisesRepo } from '@/infra/repos/mongo/MongoExercisesRepo';
import { mongooseInitPromise } from './common/initMongoose';

let AppExercisesRepo: MemoryExercisesRepo | MongoExercisesRepo;

if (process.env.NODE_ENV === 'test') {
  AppExercisesRepo = new MemoryExercisesRepo();
} else if (process.env.NODE_ENV === 'development') {
  await mongooseInitPromise;
  AppExercisesRepo = new MongoExercisesRepo();
}
// TODO implement production
else {
  throw new AdapterError(
    "AppExercisesRepo: NODE_ENV must be one of 'production', 'development', or 'test'",
  );
}

export { AppExercisesRepo };
