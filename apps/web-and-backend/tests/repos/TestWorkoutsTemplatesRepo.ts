import { MemoryWorkoutTemplatesRepo } from "../../src/infra/repos/memory/MemoryWorkoutTemplatesRepo";
import { AppWorkoutsTemplatesRepo } from "../../src/interface-adapters/app/repos/AppWorkoutsTemplatesRepo";

export const TestWorkoutsTemplatesRepo =
  AppWorkoutsTemplatesRepo as MemoryWorkoutTemplatesRepo;
