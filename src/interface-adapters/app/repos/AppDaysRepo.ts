import { FileSystemDaysRepo } from '@/infra/repos/filesystem';
import { MemoryDaysRepo } from '@/infra/repos/memory/MemoryDaysRepo';

let AppDaysRepo: FileSystemDaysRepo | MemoryDaysRepo;

if (process.env.NODE_ENV === 'test') {
  AppDaysRepo = new MemoryDaysRepo();
} else {
  AppDaysRepo = new FileSystemDaysRepo();
}

export { AppDaysRepo };
