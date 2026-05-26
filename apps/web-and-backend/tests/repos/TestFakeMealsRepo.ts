import { MemoryFakeMealsRepo } from "../../src/infra/repos/memory/MemoryFakeMealsRepo";
import { AppFakeMealsRepo } from "../../src/interface-adapters/app/repos/AppFakeMealsRepo";

export const TestFakeMealsRepo = AppFakeMealsRepo as MemoryFakeMealsRepo;
