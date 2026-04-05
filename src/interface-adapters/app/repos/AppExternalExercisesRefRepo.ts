import { AdapterError } from "@/domain/common/errors";
import { MemoryExternalExercisesRefRepo } from "@/infra/repos/memory/MemoryExternalExercisesRefRepo";
import { MongoExternalExercisesRefRepo } from "@/infra/repos/mongo/MongoExternalExercisesRefRepo";

import { mongooseInitPromise } from "./common/initMongoose";

let AppExternalExercisesRefRepo:
  | MemoryExternalExercisesRefRepo
  | MongoExternalExercisesRefRepo;

if (process.env.NODE_ENV === "test") {
  AppExternalExercisesRefRepo = new MemoryExternalExercisesRefRepo();
} else if (
  process.env.NODE_ENV === "development" ||
  process.env.NODE_ENV === "production"
) {
  await mongooseInitPromise;
  AppExternalExercisesRefRepo = new MongoExternalExercisesRefRepo();
} else {
  throw new AdapterError(
    "AppExternalExercisesRefRepo: NODE_ENV must be one of 'production', 'development', or 'test'",
  );
}

export { AppExternalExercisesRefRepo };
