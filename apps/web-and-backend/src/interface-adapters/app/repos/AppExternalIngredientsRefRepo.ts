import { MemoryExternalIngredientsRefRepo } from "../../../infra/repos/memory/MemoryExternalIngredientsRefRepo";
import { MongoExternalIngredientsRefRepo } from "../../../infra/repos/mongo/MongoExternalIngredientsRefRepo";
import { injectFor_ProductionDevelopment_Test } from "../../common/injectFor_ProductionDevelopment_Test";

import { mongooseInitPromise } from "./common/initMongoose";

const AppExternalIngredientsRefRepo:
  | MemoryExternalIngredientsRefRepo
  | MongoExternalIngredientsRefRepo =
  await injectFor_ProductionDevelopment_Test(
    MongoExternalIngredientsRefRepo,
    MemoryExternalIngredientsRefRepo,
    {
      beforeProdDev: async () => {
        await mongooseInitPromise;
      },
    },
  );

export { AppExternalIngredientsRefRepo };
