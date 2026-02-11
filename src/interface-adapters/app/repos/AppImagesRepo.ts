import { CloudinaryImagesRepo } from '@/infra/repos/cloudinary/CloudinaryImagesRepo/CloudinaryImagesRepo';
import { MemoryImagesRepo } from '@/infra/repos/memory/MemoryImagesRepo';

let AppImagesRepo: CloudinaryImagesRepo | MemoryImagesRepo;

if (process.env.NODE_ENV === 'test') {
  AppImagesRepo = new MemoryImagesRepo();
} else {
  AppImagesRepo = new CloudinaryImagesRepo();
}

export { AppImagesRepo };
