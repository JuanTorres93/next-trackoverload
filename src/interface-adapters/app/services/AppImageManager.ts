import { FileSystemImageManager } from '@/infra/filesystem';
import { AppUuidV4IdGenerator } from '@/interface-adapters/app/services/AppUuidV4IdGenerator';

export const AppImageManager = new FileSystemImageManager(
  '@/../public/file_system_image_manager_images',
  '/file_system_image_manager_images',
  AppUuidV4IdGenerator
);
