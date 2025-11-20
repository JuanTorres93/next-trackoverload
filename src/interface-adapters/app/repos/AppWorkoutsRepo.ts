import { FileSystemWorkoutsRepo } from '@/infra/filesystem';
import { MemoryWorkoutsRepo } from '@/infra/memory/MemoryWorkoutsRepo';

let AppWorkoutsRepo: FileSystemWorkoutsRepo | MemoryWorkoutsRepo;

if (process.env.NODE_ENV === 'test') {
  AppWorkoutsRepo = new MemoryWorkoutsRepo();
} else {
  AppWorkoutsRepo = new FileSystemWorkoutsRepo();
}

export { AppWorkoutsRepo };
