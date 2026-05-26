import { MemoryRecipesRepo } from "../../src/infra/repos/memory/MemoryRecipesRepo";
import { AppRecipesRepo } from "../../src/interface-adapters/app/repos/AppRecipesRepo";

export const TestRecipesRepo = AppRecipesRepo as MemoryRecipesRepo;
