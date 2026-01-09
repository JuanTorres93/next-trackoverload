import { FileSystemImagesRepo } from '@/infra/repos/filesystem/FileSystemImagesRepo';
import { MemoryImagesRepo } from '@/infra/repos/memory/MemoryImagesRepo';

let AppImagesRepo: FileSystemImagesRepo | MemoryImagesRepo;

if (process.env.NODE_ENV === 'test') {
  AppImagesRepo = new MemoryImagesRepo();
} else {
  AppImagesRepo = new FileSystemImagesRepo();
}

export { AppImagesRepo };
