import { FileSystemUsersRepo } from '@/infra/repos/filesystem';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';

let AppUsersRepo: FileSystemUsersRepo | MemoryUsersRepo;

if (process.env.NODE_ENV === 'test') {
  AppUsersRepo = new MemoryUsersRepo();
} else {
  AppUsersRepo = new FileSystemUsersRepo();
}

export { AppUsersRepo };
