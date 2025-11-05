export type UploadImageOptions = {
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
    filename: string,
    options?: UploadImageOptions
  ): Promise<ImageMetadata>;

  deleteImage(imageUrl: string): Promise<void>;

  getImageInfo(imageUrl: string): Promise<ImageMetadata | null>;

  validateImage(
    imageData: Buffer,
    options?: UploadImageOptions
  ): Promise<{ valid: boolean; errors: string[] }>;
}
