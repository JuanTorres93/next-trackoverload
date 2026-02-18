import { AdapterError } from '@/domain/common/errors';
import { MemoryExternalIngredientsRefRepo } from '@/infra/repos/memory/MemoryExternalIngredientsRefRepo';
import { MongoExternalIngredientsRefRepo } from '@/infra/repos/mongo/MongoExternalIngredientsRefRepo';
import { mongooseInitPromise } from './common/initMongoose';

let AppExternalIngredientsRefRepo:
  | MemoryExternalIngredientsRefRepo
  | MongoExternalIngredientsRefRepo;

if (process.env.NODE_ENV === 'test') {
  AppExternalIngredientsRefRepo = new MemoryExternalIngredientsRefRepo();
} else if (
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === 'production'
) {
  await mongooseInitPromise;
  AppExternalIngredientsRefRepo = new MongoExternalIngredientsRefRepo();
} else {
  throw new AdapterError(
    "AppExternalIngredientsRefRepo: NODE_ENV must be one of 'production', 'development', or 'test'",
  );
}

export { AppExternalIngredientsRefRepo };
