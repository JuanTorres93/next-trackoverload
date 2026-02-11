import { ImagesRepo, ImageType } from '@/domain/repos/ImagesRepo.port';
import { getCloudinaryInstance } from '../config';

export class CloudinaryImagesRepo implements ImagesRepo {
  private readonly cloudinary;

  constructor() {
    this.cloudinary = getCloudinaryInstance();
  }

  generateUrl(filename: string): string {
    const publicId = this.getPublicIdFromFilename(filename);

    const url = this.cloudinary.url(publicId, {
      secure: true,
    });

    return url;
  }

  async save(image: ImageType): Promise<ImageType['metadata']> {}

  async deleteByUrl(imageUrl: string): Promise<void> {}

  async getByUrl(imageUrl: string): Promise<ImageType['metadata'] | null> {}

  async duplicateByUrl(
    imageUrl: string,
    newFilename: string,
    newUrl: string,
  ): Promise<ImageType['metadata']> {}

  private getPublicIdFromFilename(filename: string): string {
    const noFileExtension = filename.replace(/\.[^/.]+$/, '');

    const timestamp = Date.now();
    return `${noFileExtension}_${timestamp}`;
  }
}
