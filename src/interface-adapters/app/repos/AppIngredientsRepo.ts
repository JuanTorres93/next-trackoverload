import { FileSystemIngredientsRepo } from '@/infra/repos/filesystem';
import { MemoryIngredientsRepo } from '@/infra/repos/memory/MemoryIngredientsRepo';

let AppIngredientsRepo: FileSystemIngredientsRepo | MemoryIngredientsRepo;

if (process.env.NODE_ENV === 'test') {
  AppIngredientsRepo = new MemoryIngredientsRepo();
} else {
  AppIngredientsRepo = new FileSystemIngredientsRepo();
}

export { AppIngredientsRepo };
