import { AdapterError } from "@/domain/common/errors";
import { MemoryExternalExercisesRefRepo } from "@/infra/repos/memory/MemoryExternalExercisesRefRepo";

import { mongooseInitPromise } from "./common/initMongoose";

let AppExternalExercisesRefRepo: MemoryExternalExercisesRefRepo;

if (process.env.NODE_ENV === "test") {
  AppExternalExercisesRefRepo = new MemoryExternalExercisesRefRepo();
} else if (
  process.env.NODE_ENV === "development" ||
  process.env.NODE_ENV === "production"
) {
  await mongooseInitPromise;
  // TODO IMPORTANT: Implement MongoExternalExercisesRefRepo and use it here instead of Memory repo for non-test environments
  AppExternalExercisesRefRepo = new MemoryExternalExercisesRefRepo();
} else {
  throw new AdapterError(
    "AppExternalExercisesRefRepo: NODE_ENV must be one of 'production', 'development', or 'test'",
  );
}

export { AppExternalExercisesRefRepo };
