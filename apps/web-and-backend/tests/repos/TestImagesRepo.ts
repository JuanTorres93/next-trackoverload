import { MemoryImagesRepo } from "../../src/infra/repos/memory/MemoryImagesRepo";
import { AppImagesRepo } from "../../src/interface-adapters/app/repos/AppImagesRepo";

export const TestImagesRepo = AppImagesRepo as MemoryImagesRepo;
