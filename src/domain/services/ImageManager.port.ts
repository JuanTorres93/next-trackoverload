export type ProcessImageOptions = {
  maxSizeMB?: number;
  allowedMimeTypes?: string[];
  quality?: number; // For compression (0-1)
};

export type ImageMetadata = {
  url: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
};

export interface ImageManager {
  uploadImage(
    imageData: Buffer,
    url: string,
    replaceIfExists: boolean
  ): Promise<ImageMetadata>;

  processImage(
    imageData: Buffer,
    options?: ProcessImageOptions
  ): Promise<Buffer>;

  deleteImage(imageUrl: string): Promise<void>;

  getImageInfo(imageUrl: string): Promise<ImageMetadata | null>;

  validateImage(
    imageData: Buffer,
    options?: ProcessImageOptions
  ): Promise<{ valid: boolean; errors: string[] }>;
}
