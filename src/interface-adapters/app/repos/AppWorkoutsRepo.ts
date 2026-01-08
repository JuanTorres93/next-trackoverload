import { FileSystemWorkoutsRepo } from '@/infra/repos/filesystem';
import { MemoryWorkoutsRepo } from '@/infra/repos/memory/MemoryWorkoutsRepo';

let AppWorkoutsRepo: FileSystemWorkoutsRepo | MemoryWorkoutsRepo;

if (process.env.NODE_ENV === 'test') {
  AppWorkoutsRepo = new MemoryWorkoutsRepo();
} else {
  AppWorkoutsRepo = new FileSystemWorkoutsRepo();
}

export { AppWorkoutsRepo };
