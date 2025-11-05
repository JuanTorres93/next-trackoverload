import {
  ImageManager,
  ImageMetadata,
  UploadImageOptions,
} from '@/domain/services/ImageManager.port';
import sharp from 'sharp';
import { fileTypeFromBuffer } from 'file-type';

export abstract class BaseImageManager implements ImageManager {
  // Abstract methods to be implemented by subclasses
  abstract uploadImage(
    imageData: Buffer,
    filename: string,
    options?: UploadImageOptions
  ): Promise<ImageMetadata>;

  abstract deleteImage(imageUrl: string): Promise<void>;

  abstract getImageInfo(imageUrl: string): Promise<ImageMetadata | null>;

  abstract getImageByUrl(imageUrl: string): Promise<Buffer | null>;

  // Shared validation method
  async validateImage(
    imageData: Buffer,
    options?: UploadImageOptions
  ): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      // 1. Check if it's a valid buffer
      if (!Buffer.isBuffer(imageData) || imageData.length === 0) {
        errors.push('Invalid or empty image data');
        return { valid: false, errors };
      }

      // 2. Detect real file type
      const uint8Array = new Uint8Array(imageData);
      const fileType = await fileTypeFromBuffer(uint8Array);
      if (!fileType) {
        errors.push('Unable to detect file type');
        return { valid: false, errors };
      }

      // 3. Check if it's an image
      if (!fileType.mime.startsWith('image/')) {
        errors.push(`File is not an image: ${fileType.mime}`);
      }

      // 4. Check allowed MIME types
      if (options?.allowedMimeTypes && options.allowedMimeTypes.length > 0) {
        const isAllowed = options.allowedMimeTypes.some((allowedType) => {
          if (allowedType.endsWith('/*')) {
            return fileType.mime.startsWith(allowedType.slice(0, -1));
          }
          return fileType.mime === allowedType;
        });

        if (!isAllowed) {
          errors.push(`File type ${fileType.mime} is not allowed`);
        }
      }

      // 5. Check size limits
      if (options?.maxSizeMB) {
        const maxBytes = options.maxSizeMB * 1024 * 1024;
        if (imageData.length > maxBytes) {
          errors.push(
            `File size ${(imageData.length / 1024 / 1024).toFixed(
              2
            )}MB exceeds limit of ${options.maxSizeMB}MB`
          );
        }
      }

      // 6. Try to process with Sharp to validate it's a valid image
      try {
        await sharp(imageData).metadata();
      } catch (sharpError) {
        errors.push(`Invalid image format: ${(sharpError as Error).message}`);
      }
    } catch (error) {
      errors.push(`Validation error: ${(error as Error).message}`);
    }

    return { valid: errors.length === 0, errors };
  }
}
