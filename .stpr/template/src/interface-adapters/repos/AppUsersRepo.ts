import { MemoryUsersRepo } from '@/infra/repos/Memory/MemoryUsersRepo';
import { MongooseUsersRepo } from '@/infra/repos/mongoose/MongooseUsersRepo';

import { injectFor_ProductionDevelopment_Test } from '../common/injectFor_ProductionDevelopment_Test';
import { mongooseInitPromise } from './common/initMongoose';

const AppUsersRepo: MemoryUsersRepo | MongooseUsersRepo =
  await injectFor_ProductionDevelopment_Test(MongooseUsersRepo, MemoryUsersRepo, {
    beforeProdDev: async () => {
      await mongooseInitPromise;
    },
  });

export { AppUsersRepo };
