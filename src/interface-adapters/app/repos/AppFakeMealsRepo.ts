import { FileSystemFakeMealsRepo } from '@/infra/repos/filesystem';
import { MemoryFakeMealsRepo } from '@/infra/repos/memory/MemoryFakeMealsRepo';

let AppFakeMealsRepo: FileSystemFakeMealsRepo | MemoryFakeMealsRepo;

if (process.env.NODE_ENV === 'test') {
  AppFakeMealsRepo = new MemoryFakeMealsRepo();
} else {
  AppFakeMealsRepo = new FileSystemFakeMealsRepo();
}

export { AppFakeMealsRepo };
