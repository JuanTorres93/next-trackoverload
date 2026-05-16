import { DaysRepo } from "../../../domain/repos/DaysRepo.port";
import { MemoryDaysRepo } from "../../../infra/repos/memory/MemoryDaysRepo";
import { MongoDaysRepo } from "../../../infra/repos/mongo/MongoDaysRepo";
import { injectFor_ProductionDevelopment_Test } from "../../common/injectFor_ProductionDevelopment_Test";

import { mongooseInitPromise } from "./common/initMongoose";

const AppDaysRepo: DaysRepo =
  await injectFor_ProductionDevelopment_Test<DaysRepo>(
    MongoDaysRepo,
    MemoryDaysRepo,
    {
      beforeProdDev: async () => {
        await mongooseInitPromise;
      },
    },
  );

export { AppDaysRepo };
