import { MemoryIngredientsRepo } from "../../src/infra/repos/memory/MemoryIngredientsRepo";
import { AppIngredientsRepo } from "../../src/interface-adapters/app/repos/AppIngredientsRepo";

export const TestIngredientsRepo = AppIngredientsRepo as MemoryIngredientsRepo;
