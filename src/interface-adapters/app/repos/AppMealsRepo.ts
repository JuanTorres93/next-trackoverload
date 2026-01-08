import { FileSystemMealsRepo } from '@/infra/repos/filesystem';
import { MemoryMealsRepo } from '@/infra/repos/memory/MemoryMealsRepo';

let AppMealsRepo: FileSystemMealsRepo | MemoryMealsRepo;

if (process.env.NODE_ENV === 'test') {
  AppMealsRepo = new MemoryMealsRepo();
} else {
  AppMealsRepo = new FileSystemMealsRepo();
}

export { AppMealsRepo };
