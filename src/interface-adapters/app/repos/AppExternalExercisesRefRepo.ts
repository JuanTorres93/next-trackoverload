import { MemoryExternalExercisesRefRepo } from "@/infra/repos/memory/MemoryExternalExercisesRefRepo";
import { MongoExternalExercisesRefRepo } from "@/infra/repos/mongo/MongoExternalExercisesRefRepo";
import { injectFor_ProductionDevelopment_Test } from "@/interface-adapters/common/injectFor_ProductionDevelopment_Test";

import { mongooseInitPromise } from "./common/initMongoose";

const AppExternalExercisesRefRepo:
  | MemoryExternalExercisesRefRepo
  | MongoExternalExercisesRefRepo = await injectFor_ProductionDevelopment_Test(
  MongoExternalExercisesRefRepo,
  MemoryExternalExercisesRefRepo,
  {
    beforeProdDev: async () => {
      await mongooseInitPromise;
    },
  },
);

export { AppExternalExercisesRefRepo };
