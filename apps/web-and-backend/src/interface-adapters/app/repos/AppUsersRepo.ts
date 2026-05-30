import { MemoryUsersRepo } from "../../../infra/repos/memory/MemoryUsersRepo";
import { MongoUsersRepo } from "../../../infra/repos/mongo/MongoUsersRepo";
import { injectFor_ProductionDevelopment_Test } from "../../common/injectFor_ProductionDevelopment_Test";
import { mongooseInitPromise } from "./common/initMongoose";

const AppUsersRepo: MemoryUsersRepo | MongoUsersRepo =
  await injectFor_ProductionDevelopment_Test(MongoUsersRepo, MemoryUsersRepo, {
    beforeProdDev: async () => {
      await mongooseInitPromise;
    },
  });

export { AppUsersRepo };
