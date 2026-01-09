import { ImagesRepo, ImageType } from '@/domain/repos/ImagesRepo.port';

export class MemoryImagesRepo implements ImagesRepo {
  private images: ImageType[] = [];

  generateUrl(filename: string): string {
    return `memory://image/${filename}-${Date.now()}`;
  }

  async save(image: ImageType): Promise<ImageType['metadata']> {
    this.images.push(image);
    return image.metadata;
  }

  async deleteByUrl(imageUrl: string): Promise<void> {
    this.images = this.images.filter((img) => img.metadata.url !== imageUrl);
  }

  async getByUrl(imageUrl: string): Promise<ImageType['metadata'] | null> {
    {
      const foundImage = this.images.find(
        (img) => img.metadata.url === imageUrl
      );
      return foundImage ? foundImage.metadata : null;
    }
  }

  // IMPORTANT NOTE: Helper method for testing - not part of the interface
  clearForTesting(): void {
    this.images = [];
  }

  // IMPORTANT NOTE: Helper method for testing - not part of the interface
  countForTesting(): number {
    return this.images.length;
  }

  // IMPORTANT NOTE: Helper method for testing - not part of the interface
  getAllForTesting(): ImageType[] {
    return [...this.images];
  }
}
