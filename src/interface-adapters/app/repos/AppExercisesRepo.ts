import { FileSystemExercisesRepo } from '@/infra/repos/filesystem';
import { MemoryExercisesRepo } from '@/infra/repos/memory/MemoryExercisesRepo';

let AppExercisesRepo: FileSystemExercisesRepo | MemoryExercisesRepo;

if (process.env.NODE_ENV === 'test') {
  AppExercisesRepo = new MemoryExercisesRepo();
} else {
  AppExercisesRepo = new FileSystemExercisesRepo();
}

export { AppExercisesRepo };
