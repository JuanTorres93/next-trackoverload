import { MemoryExercisesRepo } from "@/infra/repos/memory/MemoryExercisesRepo";
import { MongoExercisesRepo } from "@/infra/repos/mongo/MongoExercisesRepo";
import { injectFor_ProductionDevelopment_Test } from "@/interface-adapters/common/injectFor_ProductionDevelopment_Test";

import { mongooseInitPromise } from "./common/initMongoose";

const AppExercisesRepo: MemoryExercisesRepo | MongoExercisesRepo =
  await injectFor_ProductionDevelopment_Test(
    MongoExercisesRepo,
    MemoryExercisesRepo,
    {
      beforeProdDev: async () => {
        await mongooseInitPromise;
      },
    },
  );

export { AppExercisesRepo };
