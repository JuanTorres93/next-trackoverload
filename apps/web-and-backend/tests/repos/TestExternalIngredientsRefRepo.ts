import { MemoryExternalIngredientsRefRepo } from "../../src/infra/repos/memory/MemoryExternalIngredientsRefRepo";
import { AppExternalIngredientsRefRepo } from "../../src/interface-adapters/app/repos/AppExternalIngredientsRefRepo";

export const TestExternalIngredientsRefRepo =
  AppExternalIngredientsRefRepo as MemoryExternalIngredientsRefRepo;
