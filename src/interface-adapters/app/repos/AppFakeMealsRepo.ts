import { MemoryFakeMealsRepo } from "@/infra/repos/memory/MemoryFakeMealsRepo";
import { MongoFakeMealsRepo } from "@/infra/repos/mongo/MongoFakeMealsRepo";
import { injectFor_ProductionDevelopment_Test } from "@/interface-adapters/common/injectFor_ProductionDevelopment_Test";

import { mongooseInitPromise } from "./common/initMongoose";

const AppFakeMealsRepo: MemoryFakeMealsRepo | MongoFakeMealsRepo =
  await injectFor_ProductionDevelopment_Test(
    MongoFakeMealsRepo,
    MemoryFakeMealsRepo,
    {
      beforeProdDev: async () => {
        await mongooseInitPromise;
      },
    },
  );

export { AppFakeMealsRepo };
