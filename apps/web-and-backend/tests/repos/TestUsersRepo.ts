import { MemoryUsersRepo } from "../../src/infra/repos/memory/MemoryUsersRepo";
import { AppUsersRepo } from "../../src/interface-adapters/app/repos/AppUsersRepo";

export const TestUsersRepo = AppUsersRepo as MemoryUsersRepo;
