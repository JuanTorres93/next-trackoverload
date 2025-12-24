import {
  ImageMetadata,
  UploadImageOptions,
} from '@/domain/services/ImageManager.port';
import { BaseImageManager } from '@/infra/BaseImageManager';
import sharp from 'sharp';
import { fileTypeFromBuffer } from 'file-type';
import { IdGenerator } from '@/domain/services/IdGenerator.port';
import fs from 'fs/promises';
import path from 'path';
import { FS_DATA_DIR } from './common';

export class FileSystemImageManager extends BaseImageManager {
  private readonly uploadDir: string;
  private readonly baseUrl: string;
  private readonly idGenerator: IdGenerator;

  constructor(
    uploadDir: string = path.join(
      FS_DATA_DIR,
      'file_system_image_manager_images'
    ),
    baseUrl: string = '/file_system_image_manager_images',
    idGenerator: IdGenerator
  ) {
    super();
    this.uploadDir = uploadDir;
    this.baseUrl = baseUrl;
    this.idGenerator = idGenerator;
  }

  private async ensureUploadDir(): Promise<void> {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
    } catch {
      // Directory might already exist
    }
  }

  async uploadImage(
    imageData: Buffer,
    filename: string,
    options?: UploadImageOptions
  ): Promise<ImageMetadata> {
    // 1. Validar imagen usando el método heredado
    const validation = await this.validateImage(imageData, options);
    if (!validation.valid) {
      throw new Error(`Invalid image: ${validation.errors.join(', ')}`);
    }

    // 2. Asegurar que el directorio existe
    await this.ensureUploadDir();

    // 3. Generar nombre único
    const fileExtension = filename.includes('.')
      ? filename.substring(filename.lastIndexOf('.'))
      : '.png';
    const baseName = filename.includes('.')
      ? filename.substring(0, filename.lastIndexOf('.'))
      : filename;
    const uniqueFilename = `${baseName}-${this.idGenerator.generateId()}${fileExtension}`;

    // 4. Procesar imagen con Sharp si es necesario
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

    // 5. Obtener metadatos
    const sharpMetadata = await sharp(processedBuffer).metadata();
    const uint8Array = new Uint8Array(processedBuffer);
    const fileType = await fileTypeFromBuffer(uint8Array);

    // 6. Guardar archivo en disco
    const filePath = path.join(this.uploadDir, uniqueFilename);
    await fs.writeFile(filePath, processedBuffer);

    // 7. Crear metadata del resultado
    const imageMetadata: ImageMetadata = {
      url: `${this.baseUrl}/${uniqueFilename}`,
      filename: uniqueFilename,
      mimeType: fileType?.mime || 'application/octet-stream',
      sizeBytes: processedBuffer.length,
      width: sharpMetadata.width,
      height: sharpMetadata.height,
    };

    return imageMetadata;
  }

  async deleteImage(imageUrl: string): Promise<void> {
    const filename = this.extractFilenameFromUrl(imageUrl);
    if (!filename) {
      throw new Error('Invalid image URL');
    }

    const filePath = path.join(this.uploadDir, filename);

    try {
      await fs.unlink(filePath);
    } catch {
      // File might not exist - not throwing error is consistent with MemoryImageManager
    }
  }

  async getImageInfo(imageUrl: string): Promise<ImageMetadata | null> {
    const filename = this.extractFilenameFromUrl(imageUrl);
    if (!filename) {
      return null;
    }

    const filePath = path.join(this.uploadDir, filename);

    try {
      // Check if file exists
      await fs.access(filePath);

      // Read file and get metadata
      const fileData = await fs.readFile(filePath);
      const sharpMetadata = await sharp(fileData).metadata();
      const uint8Array = new Uint8Array(fileData);
      const fileType = await fileTypeFromBuffer(uint8Array);

      return {
        url: `${this.baseUrl}/${filename}`,
        filename: filename,
        mimeType: fileType?.mime || 'application/octet-stream',
        sizeBytes: fileData.length,
        width: sharpMetadata.width,
        height: sharpMetadata.height,
      };
    } catch {
      return null;
    }
  }

  // Métodos adicionales útiles para testing

  /**
   * Obtiene el buffer de datos de una imagen (útil para testing)
   */
  async getImageData(imageUrl: string): Promise<Buffer | null> {
    const filename = this.extractFilenameFromUrl(imageUrl);
    if (!filename) {
      return null;
    }

    const filePath = path.join(this.uploadDir, filename);

    try {
      return await fs.readFile(filePath);
    } catch {
      return null;
    }
  }

  /**
   * Limpia todas las imágenes almacenadas (útil para cleanup en tests)
   */
  async clear(): Promise<void> {
    try {
      const files = await fs.readdir(this.uploadDir);
      await Promise.all(
        files.map((file) => fs.unlink(path.join(this.uploadDir, file)))
      );
    } catch {
      // Directory might not exist
    }
  }

  /**
   * Obtiene el número de imágenes almacenadas (útil para assertions en tests)
   */
  async getImageCount(): Promise<number> {
    try {
      const files = await fs.readdir(this.uploadDir);
      return files.length;
    } catch {
      return 0;
    }
  }

  /**
   * Obtiene todas las URLs de imágenes almacenadas (útil para debugging en tests)
   */
  async getAllImageUrls(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.uploadDir);
      return files.map((file) => `${this.baseUrl}/${file}`);
    } catch {
      return [];
    }
  }

  private extractFilenameFromUrl(imageUrl: string): string | null {
    try {
      // Remover el prefijo de la URL base
      if (imageUrl.startsWith(this.baseUrl)) {
        return imageUrl.replace(`${this.baseUrl}/`, '');
      }

      // Si la URL no tiene el prefijo esperado, intentar extraer el nombre del archivo
      const urlParts = imageUrl.split('/');
      return urlParts[urlParts.length - 1] || null;
    } catch {
      return null;
    }
  }
}
