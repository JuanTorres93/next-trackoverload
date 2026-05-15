import { MealsRepo } from "@/domain/repos/MealsRepo.port";
import { MemoryMealsRepo } from "@/infra/repos/memory/MemoryMealsRepo";
import { MongoMealsRepo } from "@/infra/repos/mongo/MongoMealsRepo";
import { injectFor_ProductionDevelopment_Test } from "@/interface-adapters/common/injectFor_ProductionDevelopment_Test";

import { mongooseInitPromise } from "./common/initMongoose";

const AppMealsRepo: MealsRepo =
  await injectFor_ProductionDevelopment_Test<MealsRepo>(
    MongoMealsRepo,
    MemoryMealsRepo,
    {
      beforeProdDev: async () => {
        await mongooseInitPromise;
      },
    },
  );

export { AppMealsRepo };
