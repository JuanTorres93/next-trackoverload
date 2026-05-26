import { MemoryDaysRepo } from "../../src/infra/repos/memory/MemoryDaysRepo";
import { AppDaysRepo } from "../../src/interface-adapters/app/repos/AppDaysRepo";

export const TestDaysRepo = AppDaysRepo as MemoryDaysRepo;
