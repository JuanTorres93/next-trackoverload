import { FileSystemDaysRepo } from '@/infra/filesystem';
import { MemoryDaysRepo } from '@/infra/memory/MemoryDaysRepo';

let AppDaysRepo: FileSystemDaysRepo | MemoryDaysRepo;

if (process.env.NODE_ENV === 'test') {
  AppDaysRepo = new MemoryDaysRepo();
} else {
  AppDaysRepo = new FileSystemDaysRepo();
}

export { AppDaysRepo };
