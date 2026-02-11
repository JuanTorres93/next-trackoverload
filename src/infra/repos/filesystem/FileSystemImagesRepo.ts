import { ImagesRepo, ImageType } from '@/domain/repos/ImagesRepo.port';
import fs from 'fs/promises';
import path from 'path';

const PUBLIC_DIR = '@/../public';

export class FileSystemImagesRepo implements ImagesRepo {
  private readonly imagesDir: string;
  private readonly baseUrl: string;

  constructor(
    imagesDir: string = path.join(PUBLIC_DIR, 'file_system_image_repo'),
    baseUrl: string = '/file_system_image_repo',
  ) {
    this.imagesDir = imagesDir;
    this.baseUrl = baseUrl;
  }

  generateUrl(filename: string): string {
    return `${this.baseUrl}/${filename}`;
  }

  private async ensureImagesDir(): Promise<void> {
    try {
      await fs.mkdir(this.imagesDir, { recursive: true });
    } catch {
      // Directory might already exist
    }
  }

  async save(image: ImageType): Promise<ImageType['metadata']> {
    await this.ensureImagesDir();

    const filename = image.metadata.filename;
    const filePath = path.join(this.imagesDir, filename);
    const url = this.generateUrl(filename);

    // Save image buffer to disk
    await fs.writeFile(filePath, image.buffer);

    // Save metadata
    const metadata: ImageType['metadata'] = {
      ...image.metadata,
      url,
      filename,
    };

    const metadataPath = path.join(this.imagesDir, `${filename}.metadata.json`);
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));

    return metadata;
  }

  async deleteByUrl(imageUrl: string): Promise<void> {
    const filename = this.extractFilenameFromUrl(imageUrl);
    if (!filename) {
      return;
    }

    const filePath = path.join(this.imagesDir, filename);
    const metadataPath = path.join(this.imagesDir, `${filename}.metadata.json`);

    try {
      await fs.unlink(filePath);
    } catch {
      // File might not exist
    }

    try {
      await fs.unlink(metadataPath);
    } catch {
      // Metadata file might not exist
    }
  }

  async getByUrl(imageUrl: string): Promise<ImageType['metadata'] | null> {
    const filename = this.extractFilenameFromUrl(imageUrl);
    if (!filename) {
      return null;
    }

    const metadataPath = path.join(this.imagesDir, `${filename}.metadata.json`);

    try {
      const metadataContent = await fs.readFile(metadataPath, 'utf-8');
      return JSON.parse(metadataContent);
    } catch {
      return null;
    }
  }

  private extractFilenameFromUrl(imageUrl: string | undefined): string | null {
    if (!imageUrl) return null;

    if (imageUrl.startsWith(this.baseUrl)) {
      return imageUrl.replace(`${this.baseUrl}/`, '');
    }

    const urlParts = imageUrl.split('/');
    return urlParts[urlParts.length - 1] || null;
  }

  // IMPORTANT NOTE: Helper method for testing - not part of the interface
  async clearForTesting(): Promise<void> {
    try {
      const files = await fs.readdir(this.imagesDir);
      await Promise.all(
        files.map((file) => fs.unlink(path.join(this.imagesDir, file))),
      );
    } catch {
      // Directory might not exist
    }
  }

  // IMPORTANT NOTE: Helper method for testing - not part of the interface
  async countForTesting(): Promise<number> {
    try {
      const files = await fs.readdir(this.imagesDir);
      // Count only image files, not metadata files
      return files.filter((file) => !file.endsWith('.metadata.json')).length;
    } catch {
      return 0;
    }
  }

  // IMPORTANT NOTE: Helper method for testing - not part of the interface
  async getAllForTesting(): Promise<ImageType[]> {
    try {
      const files = await fs.readdir(this.imagesDir);
      const imageFiles = files.filter(
        (file) => !file.endsWith('.metadata.json'),
      );

      const images: ImageType[] = [];
      for (const filename of imageFiles) {
        const filePath = path.join(this.imagesDir, filename);
        const metadataPath = path.join(
          this.imagesDir,
          `${filename}.metadata.json`,
        );

        try {
          const buffer = await fs.readFile(filePath);
          const metadataContent = await fs.readFile(metadataPath, 'utf-8');
          const metadata = JSON.parse(metadataContent);

          images.push({ buffer, metadata });
        } catch {
          // Skip files that can't be read
        }
      }

      return images;
    } catch {
      return [];
    }
  }
}
