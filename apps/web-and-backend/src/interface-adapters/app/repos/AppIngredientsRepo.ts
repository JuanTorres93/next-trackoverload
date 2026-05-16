import { MemoryIngredientsRepo } from "../../../infra/repos/memory/MemoryIngredientsRepo";
import { MongoIngredientsRepo } from "../../../infra/repos/mongo/MongoIngredientsRepo";
import { injectFor_ProductionDevelopment_Test } from "../../common/injectFor_ProductionDevelopment_Test";

import { mongooseInitPromise } from "./common/initMongoose";

const AppIngredientsRepo: MemoryIngredientsRepo | MongoIngredientsRepo =
  await injectFor_ProductionDevelopment_Test(
    MongoIngredientsRepo,
    MemoryIngredientsRepo,
    {
      beforeProdDev: async () => {
        await mongooseInitPromise;
      },
    },
  );

export { AppIngredientsRepo };
