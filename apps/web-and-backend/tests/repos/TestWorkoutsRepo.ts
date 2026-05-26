import { MemoryWorkoutsRepo } from "../../src/infra/repos/memory/MemoryWorkoutsRepo";
import { AppWorkoutsRepo } from "../../src/interface-adapters/app/repos/AppWorkoutsRepo";

export const TestWorkoutsRepo = AppWorkoutsRepo as MemoryWorkoutsRepo;
