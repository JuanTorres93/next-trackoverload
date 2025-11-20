import { FileSystemFakeMealsRepo } from '@/infra/filesystem';
import { MemoryFakeMealsRepo } from '@/infra/memory/MemoryFakeMealsRepo';

let AppFakeMealsRepo: FileSystemFakeMealsRepo | MemoryFakeMealsRepo;

if (process.env.NODE_ENV === 'test') {
  AppFakeMealsRepo = new MemoryFakeMealsRepo();
} else {
  AppFakeMealsRepo = new FileSystemFakeMealsRepo();
}

export { AppFakeMealsRepo };
