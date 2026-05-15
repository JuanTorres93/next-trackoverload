import { WorkoutTemplatesRepo } from "@/domain/repos/WorkoutTemplatesRepo.port";
import { MemoryWorkoutTemplatesRepo } from "@/infra/repos/memory/MemoryWorkoutTemplatesRepo";
import { MongoWorkoutTemplatesRepo } from "@/infra/repos/mongo/MongoWorkoutTemplatesRepo";
import { injectFor_ProductionDevelopment_Test } from "@/interface-adapters/common/injectFor_ProductionDevelopment_Test";

import { mongooseInitPromise } from "./common/initMongoose";

const AppWorkoutsTemplatesRepo: WorkoutTemplatesRepo =
  await injectFor_ProductionDevelopment_Test<WorkoutTemplatesRepo>(
    MongoWorkoutTemplatesRepo,
    MemoryWorkoutTemplatesRepo,
    {
      beforeProdDev: async () => {
        await mongooseInitPromise;
      },
    },
  );

export { AppWorkoutsTemplatesRepo };
