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

  async save(image: ImageType): Promise<ImageType['metadata']> {
    const publicId = this.getPublicIdFromFilename(image.metadata.filename);
    const base64Image = `data:${image.metadata.mimeType};base64,${image.buffer.toString('base64')}`;

    const uploadResult = await this.cloudinary.uploader.upload(base64Image, {
      public_id: publicId,
      resource_type: 'image',
    });

    return {
      url: uploadResult.secure_url,
      filename: image.metadata.filename,
      mimeType: image.metadata.mimeType,
      sizeBytes: uploadResult.bytes,
    };
  }

  async deleteByUrl(imageUrl: string): Promise<void> {
    const publicId = this.extractPublicIdFromUrl(imageUrl);
    await this.cloudinary.uploader.destroy(publicId);
  }

  async getByUrl(imageUrl: string): Promise<ImageType['metadata'] | null> {
    const publicId = this.extractPublicIdFromUrl(imageUrl);

    try {
      const result = await this.cloudinary.api.resource(publicId);

      return {
        url: result.secure_url,
        filename: `${publicId}.${result.format}`,
        mimeType: `image/${result.format}`,
        sizeBytes: result.bytes,
      };
    } catch (error: unknown) {
      // If resource not found (404), return null
      if (error.error?.http_code === 404) {
        return null;
      }
      throw error;
    }
  }

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

  private extractPublicIdFromUrl(url: string): string {
    // Extract public_id from Cloudinary URL
    // Format: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/v{version}/{public_id}.{format}
    const matches = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
    if (!matches || !matches[1]) {
      throw new Error(`Invalid Cloudinary URL: ${url}`);
    }
    return matches[1];
  }
}
