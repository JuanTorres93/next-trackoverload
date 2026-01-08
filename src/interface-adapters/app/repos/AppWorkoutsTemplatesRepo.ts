import { FileSystemWorkoutTemplatesRepo } from '@/infra/repos/filesystem';
import { MemoryWorkoutTemplatesRepo } from '@/infra/repos/memory/MemoryWorkoutTemplatesRepo';

let AppWorkoutsTemplatesRepo:
  | FileSystemWorkoutTemplatesRepo
  | MemoryWorkoutTemplatesRepo;

if (process.env.NODE_ENV === 'test') {
  AppWorkoutsTemplatesRepo = new MemoryWorkoutTemplatesRepo();
} else {
  AppWorkoutsTemplatesRepo = new FileSystemWorkoutTemplatesRepo();
}

export { AppWorkoutsTemplatesRepo };
