import { MemoryExternalExercisesRefRepo } from "../../src/infra/repos/memory/MemoryExternalExercisesRefRepo";
import { AppExternalExercisesRefRepo } from "../../src/interface-adapters/app/repos/AppExternalExercisesRefRepo";

export const TestExternalExercisesRefRepo =
  AppExternalExercisesRefRepo as MemoryExternalExercisesRefRepo;
