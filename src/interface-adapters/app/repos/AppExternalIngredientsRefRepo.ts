import { FileSystemExternalIngredientsRefRepo } from '@/infra/repos/filesystem/FileSystemExternalIngredientsRefRepo';
import { MemoryExternalIngredientsRefRepo } from '@/infra/repos/memory/MemoryExternalIngredientsRefRepo';

let AppExternalIngredientsRefRepo:
  | FileSystemExternalIngredientsRefRepo
  | MemoryExternalIngredientsRefRepo;

if (process.env.NODE_ENV === 'test') {
  AppExternalIngredientsRefRepo = new MemoryExternalIngredientsRefRepo();
} else {
  AppExternalIngredientsRefRepo = new FileSystemExternalIngredientsRefRepo();
}

export { AppExternalIngredientsRefRepo };
