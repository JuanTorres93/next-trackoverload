import { MemoryExercisesRepo } from "../../src/infra/repos/memory/MemoryExercisesRepo";
import { AppExercisesRepo } from "../../src/interface-adapters/app/repos/AppExercisesRepo";

export const TestExercisesRepo = AppExercisesRepo as MemoryExercisesRepo;
