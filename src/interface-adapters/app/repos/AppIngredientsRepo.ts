import { AdapterError } from '@/domain/common/errors';
import { MemoryIngredientsRepo } from '@/infra/repos/memory/MemoryIngredientsRepo';
import { MongoIngredientsRepo } from '@/infra/repos/mongo/MongoIngredientsRepo';
import { mongooseInitPromise } from './common/initMongoose';

let AppIngredientsRepo: MemoryIngredientsRepo | MongoIngredientsRepo;

if (process.env.NODE_ENV === 'test') {
  AppIngredientsRepo = new MemoryIngredientsRepo();
} else if (process.env.NODE_ENV === 'development') {
  await mongooseInitPromise;
  AppIngredientsRepo = new MongoIngredientsRepo();
}
// TODO implement production
else {
  throw new AdapterError(
    "AppIngredientsRepo: NODE_ENV must be one of 'production', 'development', or 'test'",
  );
}

export { AppIngredientsRepo };
