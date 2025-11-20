import { FileSystemWorkoutTemplatesRepo } from '@/infra/filesystem';
import { MemoryWorkoutTemplatesRepo } from '@/infra/memory/MemoryWorkoutTemplatesRepo';

let AppWorkoutsTemplatesRepo:
  | FileSystemWorkoutTemplatesRepo
  | MemoryWorkoutTemplatesRepo;

if (process.env.NODE_ENV === 'test') {
  AppWorkoutsTemplatesRepo = new MemoryWorkoutTemplatesRepo();
} else {
  AppWorkoutsTemplatesRepo = new FileSystemWorkoutTemplatesRepo();
}

export { AppWorkoutsTemplatesRepo };
