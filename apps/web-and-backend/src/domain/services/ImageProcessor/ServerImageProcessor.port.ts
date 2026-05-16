export interface ImageProcessor {
  compressToMaxMB(imageData: Buffer, maxMB: number): Promise<Buffer>;

  resizeToSquare(imageData: Buffer, sizeInPixels: number): Promise<Buffer>;

  validate(imageData: Buffer): Promise<void>;
}
