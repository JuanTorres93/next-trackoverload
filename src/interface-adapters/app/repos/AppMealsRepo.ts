import { AdapterError } from '@/domain/common/errors';
import { MemoryMealsRepo } from '@/infra/repos/memory/MemoryMealsRepo';
import { MongoMealsRepo } from '@/infra/repos/mongo/MongoMealsRepo';
import { mongooseInitPromise } from './common/initMongoose';

let AppMealsRepo: MemoryMealsRepo | MongoMealsRepo;

if (process.env.NODE_ENV === 'test') {
  AppMealsRepo = new MemoryMealsRepo();
} else if (process.env.NODE_ENV === 'development') {
  await mongooseInitPromise;
  AppMealsRepo = new MongoMealsRepo();
}
// TODO implement production
else {
  throw new AdapterError(
    "AppMealsRepo: NODE_ENV must be one of 'production', 'development', or 'test'",
  );
}

export { AppMealsRepo };
