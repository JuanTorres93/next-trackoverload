import { FileSystemUsersRepo } from '@/infra/filesystem';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';

let AppUsersRepo: FileSystemUsersRepo | MemoryUsersRepo;

if (process.env.NODE_ENV === 'test') {
  AppUsersRepo = new MemoryUsersRepo();
} else {
  AppUsersRepo = new FileSystemUsersRepo();
}

export { AppUsersRepo };
