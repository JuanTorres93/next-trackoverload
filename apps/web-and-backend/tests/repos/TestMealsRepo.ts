import { MemoryMealsRepo } from "../../src/infra/repos/memory/MemoryMealsRepo";
import { AppMealsRepo } from "../../src/interface-adapters/app/repos/AppMealsRepo";

export const TestMealsRepo = AppMealsRepo as MemoryMealsRepo;
