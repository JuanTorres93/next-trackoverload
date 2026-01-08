import { IdGenerator } from '@/domain/services/IdGenerator.port';
import { ImageMetadata } from '@/domain/services/ImageManager.port';
import {
  BaseImageManager,
  DEFAULT_PROCESS_OPTIONS,
} from '@/infra/BaseImageManager';

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
    filename: string
  ): Promise<ImageMetadata> {
    // 1. Validate image
    const validation = await this.validateImage(imageData);
    if (!validation.valid) {
      throw new Error(`Invalid image: ${validation.errors.join(', ')}`);
    }

    // 2. Create unique filename
    const fileExtension = filename.includes('.')
      ? filename.substring(filename.lastIndexOf('.'))
      : '.png';

    const baseName = filename.includes('.')
      ? filename.substring(0, filename.lastIndexOf('.'))
      : filename;
    const uniqueFilename = `${baseName}-${this.idGenerator.generateId()}${fileExtension}`;

    // 3. Process image
    const processedBuffer = await this.processImage(
      imageData,
      DEFAULT_PROCESS_OPTIONS
    );

    // 4. Get metadata
    const { sharpMetadata, fileType } = await this._getMetadata(
      processedBuffer
    );

    // 5. Create metadata of the result
    const imageMetadata: ImageMetadata = {
      url: `${this.baseUrl}/${uniqueFilename}`,
      filename: uniqueFilename,
      mimeType: fileType?.mime || 'application/octet-stream',
      sizeBytes: processedBuffer.length,
      width: sharpMetadata.width,
      height: sharpMetadata.height,
    };

    // 6. Store in memory
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
