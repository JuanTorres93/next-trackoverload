import {
  ImageMetadata,
  UploadImageOptions,
} from '@/domain/services/ImageManager.port';
import { BaseImageManager } from '@/infra/BaseImageManager';
import sharp from 'sharp';
import { fileTypeFromBuffer } from 'file-type';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export class FileSystemImageManager extends BaseImageManager {
  private readonly uploadsDir: string;
  private readonly baseUrl: string;

  constructor(baseUrl: string = '/file_system_image_manager_images') {
    super();
    this.baseUrl = baseUrl;
    // Store images in public folder with specific subdirectory
    this.uploadsDir = `public${baseUrl}`;
  }

  async uploadImage(
    imageData: Buffer,
    filename: string,
    options?: UploadImageOptions
  ): Promise<ImageMetadata> {
    // 1. Validate image
    const validation = await this.validateImage(imageData, options);
    if (!validation.valid) {
      throw new Error(`Invalid image: ${validation.errors.join(', ')}`);
    }

    // 2. Generate unique filename
    const fileExtension = path.extname(filename);
    const baseName = path.basename(filename, fileExtension);
    const uniqueFilename = `${baseName}-${uuidv4()}${fileExtension}`;

    // 3. Ensure directory exists
    await this.ensureDirectoryExists();

    // 4. Process image with Sharp
    const outputPath = path.join(this.uploadsDir, uniqueFilename);

    let processedImage = sharp(imageData)
      // Convert to square
      .resize({
        width: 1000,
        height: 1000,
        fit: 'cover',
        position: 'center',
      });

    // Apply quality options if specified
    if (options?.quality && options.quality < 1) {
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
    }

    // 5. Save processed image
    await processedImage.toFile(outputPath);

    // 6. Get final metadata
    const finalMetadata = await sharp(outputPath).metadata();
    const fileStats = await fs.stat(outputPath);
    const fileBuffer = await fs.readFile(outputPath);
    const fileType = await fileTypeFromBuffer(new Uint8Array(fileBuffer));

    return {
      url: `${this.baseUrl}/${uniqueFilename}`,
      filename: uniqueFilename,
      mimeType: fileType?.mime || 'application/octet-stream',
      sizeBytes: fileStats.size,
      width: finalMetadata.width,
      height: finalMetadata.height,
    };
  }

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extract filename from URL
      const filename = this.extractFilenameFromUrl(imageUrl);
      if (!filename) {
        throw new Error('Invalid image URL');
      }

      const filePath = path.join(this.uploadsDir, filename);

      // Check if file exists before deleting
      try {
        await fs.access(filePath);
        await fs.unlink(filePath);
      } catch (error) {
        // If file does not exist, it's not a critical error
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
          throw error;
        }
      }
    } catch (error) {
      throw new Error(`Failed to delete image: ${(error as Error).message}`);
    }
  }

  async getImageInfo(imageUrl: string): Promise<ImageMetadata | null> {
    try {
      const filename = this.extractFilenameFromUrl(imageUrl);
      if (!filename) {
        return null;
      }

      const filePath = path.join(this.uploadsDir, filename);

      // Check if file exists
      try {
        await fs.access(filePath);
      } catch {
        return null;
      }

      const fileStats = await fs.stat(filePath);
      const metadata = await sharp(filePath).metadata();
      const fileBuffer = await fs.readFile(filePath);
      const fileType = await fileTypeFromBuffer(new Uint8Array(fileBuffer));

      return {
        url: imageUrl,
        filename: filename,
        mimeType: fileType?.mime || 'application/octet-stream',
        sizeBytes: fileStats.size,
        width: metadata.width,
        height: metadata.height,
      };
    } catch (error) {
      console.error('Error getting image info:', error);
      return null;
    }
  }

  private async ensureDirectoryExists(): Promise<void> {
    try {
      await fs.access(this.uploadsDir);
    } catch {
      await fs.mkdir(this.uploadsDir, { recursive: true });
    }
  }

  private extractFilenameFromUrl(imageUrl: string): string | null {
    try {
      // Remove base URL prefix
      if (imageUrl.startsWith(this.baseUrl)) {
        return imageUrl.replace(`${this.baseUrl}/`, '');
      }

      // If URL does not have expected prefix, try to extract filename
      const urlParts = imageUrl.split('/');
      return urlParts[urlParts.length - 1] || null;
    } catch {
      return null;
    }
  }
}
