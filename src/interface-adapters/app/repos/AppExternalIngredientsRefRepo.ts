import { FileSystemExternalIngredientsRefRepo } from '@/infra/filesystem/FileSystemExternalIngredientsRefRepo';
import { MemoryExternalIngredientsRefRepo } from '@/infra/memory/MemoryExternalIngredientsRefRepo';

let AppExternalIngredientsRefRepo:
  | FileSystemExternalIngredientsRefRepo
  | MemoryExternalIngredientsRefRepo;

if (process.env.NODE_ENV === 'test') {
  AppExternalIngredientsRefRepo = new MemoryExternalIngredientsRefRepo();
} else {
  AppExternalIngredientsRefRepo = new FileSystemExternalIngredientsRefRepo();
}

export { AppExternalIngredientsRefRepo };
