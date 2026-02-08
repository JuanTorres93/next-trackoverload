import { AdapterError } from '@/domain/common/errors';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { MongoUsersRepo } from '@/infra/repos/mongo/MongoUsersRepo';
import { mongooseInitPromise } from './common/initMongoose';

let AppUsersRepo: MemoryUsersRepo | MongoUsersRepo;

if (process.env.NODE_ENV === 'test') {
  AppUsersRepo = new MemoryUsersRepo();
} else if (process.env.NODE_ENV === 'development') {
  await mongooseInitPromise;
  AppUsersRepo = new MongoUsersRepo();
}
// TODO implement production
else {
  throw new AdapterError(
    "AppUsersRepo: NODE_ENV must be one of 'production', 'development', or 'test'",
  );
}

export { AppUsersRepo };
