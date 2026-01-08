export interface ImageProcessor {
  compress(imageData: Buffer, quality: number): Promise<Buffer>;

  validate(imageData: Buffer): Promise<void>;
}
