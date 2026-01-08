import {
  ImageManager,
  ImageMetadata,
  ProcessImageOptions,
} from '@/domain/services/ImageManager.port';
import sharp from 'sharp';
import { fileTypeFromBuffer, FileTypeResult } from 'file-type';

export const DEFAULT_PROCESS_OPTIONS: ProcessImageOptions = {
  maxSizeMB: 5,
  allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg'],
  quality: 0.8,
};

export abstract class BaseImageManager implements ImageManager {
  // Abstract methods to be implemented by subclasses
  abstract uploadImage(
    imageData: Buffer,
    filename: string,
    options?: ProcessImageOptions
  ): Promise<ImageMetadata>;

  abstract deleteImage(imageUrl: string): Promise<void>;

  abstract getImageInfo(imageUrl: string): Promise<ImageMetadata | null>;

  // Shared process method
  async processImage(
    imageData: Buffer,
    options?: ProcessImageOptions
  ): Promise<Buffer> {
    let processedBuffer = imageData;

    if (options?.quality && options.quality < 1) {
      let processedImage = sharp(imageData);

      const metadata = await processedImage.metadata();

      if (metadata.format === 'jpeg') {
        processedImage = processedImage.jpeg({
          quality: Math.round(options.quality * 100),
        });
      } else if (metadata.format === 'png') {
        processedImage = processedImage.png({
          quality: Math.round(options.quality * 100),
        });
      } else if (metadata.format === 'webp') {
        processedImage = processedImage.webp({
          quality: Math.round(options.quality * 100),
        });
      }

      processedBuffer = await processedImage.toBuffer();
    }

    return processedBuffer;
  }

  // Shared validation method
  async validateImage(
    imageData: Buffer
  ): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];
    const options = { ...DEFAULT_PROCESS_OPTIONS };

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

  protected async _getMetadata(imageData: Buffer): Promise<{
    sharpMetadata: sharp.Metadata;
    fileType: FileTypeResult | undefined;
  }> {
    const sharpMetadata = await sharp(imageData).metadata();
    const uint8Array = new Uint8Array(imageData);
    const fileType = await fileTypeFromBuffer(uint8Array);

    return {
      sharpMetadata,
      fileType,
    };
  }
}
