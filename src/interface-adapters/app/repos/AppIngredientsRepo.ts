import { FileSystemIngredientsRepo } from '@/infra/filesystem';
import { MemoryIngredientsRepo } from '@/infra/memory/MemoryIngredientsRepo';

let AppIngredientsRepo: FileSystemIngredientsRepo | MemoryIngredientsRepo;

if (process.env.NODE_ENV === 'test') {
  AppIngredientsRepo = new MemoryIngredientsRepo();
} else {
  AppIngredientsRepo = new FileSystemIngredientsRepo();
}

export { AppIngredientsRepo };
