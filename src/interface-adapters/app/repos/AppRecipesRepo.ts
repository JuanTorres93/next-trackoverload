import { RecipesRepo } from "@/domain/repos/RecipesRepo.port";
import { MemoryRecipesRepo } from "@/infra/repos/memory/MemoryRecipesRepo";
import { MongoRecipesRepo } from "@/infra/repos/mongo/MongoRecipesRepo";
import { injectFor_ProductionDevelopment_Test } from "@/interface-adapters/common/injectFor_ProductionDevelopment_Test";

import { mongooseInitPromise } from "./common/initMongoose";

const AppRecipesRepo: RecipesRepo =
  await injectFor_ProductionDevelopment_Test<RecipesRepo>(
    MongoRecipesRepo,
    MemoryRecipesRepo,
    {
      beforeProdDev: async () => {
        await mongooseInitPromise;
      },
    },
  );

export { AppRecipesRepo };
