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
        (img) => img.metadata.url === imageUrl,
      );
      return foundImage ? foundImage.metadata : null;
    }
  }

  async duplicateByUrl(imageUrl: string): Promise<ImageType['metadata']> {
    const foundImage = this.images.find((img) => img.metadata.url === imageUrl);

    if (!foundImage) {
      throw new Error(`Image not found with URL: ${imageUrl}`);
    }

    // Extract the base filename without timestamp
    const originalFilename = foundImage.metadata.filename;
    const baseFilename = originalFilename.replace(/-\d+(\.\w+)?$/, '$1');

    // Generate new filename and URL with new timestamp
    const newFilename = `${baseFilename.replace(/\.\w+$/, '')}-${Date.now()}${baseFilename.match(/\.\w+$/)?.[0] || ''}`;
    const newUrl = this.generateUrl(newFilename);

    // Create duplicated image
    const duplicatedImage: ImageType = {
      buffer: foundImage.buffer,
      metadata: {
        ...foundImage.metadata,
        url: newUrl,
        filename: newFilename,
      },
    };

    this.images.push(duplicatedImage);
    return duplicatedImage.metadata;
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
