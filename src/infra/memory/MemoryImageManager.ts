import {
  ImageMetadata,
  UploadImageOptions,
} from '@/domain/services/ImageManager.port';
import { BaseImageManager } from '@/infra/BaseImageManager';
import sharp from 'sharp';
import { fileTypeFromBuffer } from 'file-type';
import { IdGenerator } from '@/domain/services/IdGenerator.port';

interface StoredImage {
  filename: string;
  data: Buffer;
  metadata: ImageMetadata;
}

export class MemoryImageManager extends BaseImageManager {
  private images: Map<string, StoredImage> = new Map();
  private readonly baseUrl: string;
  private readonly idGenerator: IdGenerator;

  constructor(baseUrl: string = '/memory/images', idGenerator: IdGenerator) {
    super();
    this.baseUrl = baseUrl;
    this.idGenerator = idGenerator;
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

    // 2. Generar nombre único
    const fileExtension = filename.includes('.')
      ? filename.substring(filename.lastIndexOf('.'))
      : '.png';
    const baseName = filename.includes('.')
      ? filename.substring(0, filename.lastIndexOf('.'))
      : filename;
    const uniqueFilename = `${baseName}-${this.idGenerator.generateId()}${fileExtension}`;

    // 3. Procesar imagen con Sharp (similar a FileSystemImageManager)
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

    // 4. Obtener metadatos
    const sharpMetadata = await sharp(processedBuffer).metadata();
    const uint8Array = new Uint8Array(processedBuffer);
    const fileType = await fileTypeFromBuffer(uint8Array);

    // 5. Crear metadata del resultado
    const imageMetadata: ImageMetadata = {
      url: `${this.baseUrl}/${uniqueFilename}`,
      filename: uniqueFilename,
      mimeType: fileType?.mime || 'application/octet-stream',
      sizeBytes: processedBuffer.length,
      width: sharpMetadata.width,
      height: sharpMetadata.height,
    };

    // 6. Almacenar en memoria
    this.images.set(uniqueFilename, {
      filename: uniqueFilename,
      data: processedBuffer,
      metadata: imageMetadata,
    });

    return imageMetadata;
  }

  async deleteImage(imageUrl: string): Promise<void> {
    const filename = this.extractFilenameFromUrl(imageUrl);
    if (!filename) {
      throw new Error('Invalid image URL');
    }

    // En memoria, simplemente eliminamos de la Map
    // No es error si no existe (similar a FileSystemImageManager)
    this.images.delete(filename);
  }

  async getImageInfo(imageUrl: string): Promise<ImageMetadata | null> {
    const filename = this.extractFilenameFromUrl(imageUrl);
    if (!filename) {
      return null;
    }

    const storedImage = this.images.get(filename);
    return storedImage ? storedImage.metadata : null;
  }

  // Métodos adicionales útiles para testing

  /**
   * Obtiene el buffer de datos de una imagen (útil para testing)
   */
  getImageData(imageUrl: string): Buffer | null {
    const filename = this.extractFilenameFromUrl(imageUrl);
    if (!filename) {
      return null;
    }

    const storedImage = this.images.get(filename);
    return storedImage ? storedImage.data : null;
  }

  /**
   * Limpia todas las imágenes almacenadas (útil para cleanup en tests)
   */
  clear(): void {
    this.images.clear();
  }

  /**
   * Obtiene el número de imágenes almacenadas (útil para assertions en tests)
   */
  getImageCount(): number {
    return this.images.size;
  }

  /**
   * Obtiene todas las URLs de imágenes almacenadas (útil para debugging en tests)
   */
  getAllImageUrls(): string[] {
    return Array.from(this.images.values()).map((img) => img.metadata.url);
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
