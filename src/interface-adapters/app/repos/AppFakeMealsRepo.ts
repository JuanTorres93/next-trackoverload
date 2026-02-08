import { AdapterError } from '@/domain/common/errors';
import { MemoryFakeMealsRepo } from '@/infra/repos/memory/MemoryFakeMealsRepo';
import { MongoFakeMealsRepo } from '@/infra/repos/mongo/MongoFakeMealsRepo';
import { mongooseInitPromise } from './common/initMongoose';

let AppFakeMealsRepo: MemoryFakeMealsRepo | MongoFakeMealsRepo;

if (process.env.NODE_ENV === 'test') {
  AppFakeMealsRepo = new MemoryFakeMealsRepo();
} else if (process.env.NODE_ENV === 'development') {
  await mongooseInitPromise;
  AppFakeMealsRepo = new MongoFakeMealsRepo();
}
// TODO implement production
else {
  throw new AdapterError(
    "AppFakeMealsRepo: NODE_ENV must be one of 'production', 'development', or 'test'",
  );
}

export { AppFakeMealsRepo };
