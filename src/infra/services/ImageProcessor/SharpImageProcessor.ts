import sharp from 'sharp';

import { ImageProcessor } from '../../../domain/services/ImageProcessor.port.js';

export class SharpImageProcessor implements ImageProcessor {
  async compress(imageData: Buffer, quality: number): Promise<Buffer> {
    return sharp(imageData).jpeg({ quality, mozjpeg: true }).toBuffer();
  }

  async validate(imageData: Buffer): Promise<void> {
    try {
      await sharp(imageData).metadata();
    } catch {
      throw new Error('Invalid image data');
    }
  }
}
