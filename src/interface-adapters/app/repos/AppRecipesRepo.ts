import { FileSystemRecipesRepo } from '@/infra/repos/filesystem';
import { MemoryRecipesRepo } from '@/infra/repos/memory/MemoryRecipesRepo';

let AppRecipesRepo: FileSystemRecipesRepo | MemoryRecipesRepo;

if (process.env.NODE_ENV === 'test') {
  AppRecipesRepo = new MemoryRecipesRepo();
} else {
  AppRecipesRepo = new FileSystemRecipesRepo();
}

export { AppRecipesRepo };
