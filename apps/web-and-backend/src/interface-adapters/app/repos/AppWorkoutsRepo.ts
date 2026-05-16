import { WorkoutsRepo } from "../../../domain/repos/WorkoutsRepo.port";
import { MemoryWorkoutsRepo } from "../../../infra/repos/memory/MemoryWorkoutsRepo";
import { MongoWorkoutsRepo } from "../../../infra/repos/mongo/MongoWorkoutsRepo";
import { injectFor_ProductionDevelopment_Test } from "../../common/injectFor_ProductionDevelopment_Test";

import { mongooseInitPromise } from "./common/initMongoose";

const AppWorkoutsRepo: WorkoutsRepo =
  await injectFor_ProductionDevelopment_Test<WorkoutsRepo>(
    MongoWorkoutsRepo,
    MemoryWorkoutsRepo,
    {
      beforeProdDev: async () => {
        await mongooseInitPromise;
      },
    },
  );

export { AppWorkoutsRepo };
