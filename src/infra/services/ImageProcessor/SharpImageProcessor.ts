import sharp from 'sharp';

import { ImageProcessor } from '../../../domain/services/ImageProcessor.port.js';

export class SharpImageProcessor implements ImageProcessor {
  async compressToMaxMB(imageData: Buffer, maxSizeMB = 2): Promise<Buffer> {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    let quality = 85;
    let output: Buffer;

    // Iterative compression attempts
    while (quality >= 50) {
      output = await sharp(imageData)
        .jpeg({ quality, mozjpeg: true })
        .toBuffer();

      if (output.length <= maxSizeBytes) {
        return output;
      }

      quality -= 5;
    }

    // Fallback
    return await sharp(imageData)
      .jpeg({ quality: 30, mozjpeg: true })
      .toBuffer();
  }

  resizeToSquare(imageData: Buffer, sizeInPixels: number): Promise<Buffer> {
    return sharp(imageData)
      .resize(sizeInPixels, sizeInPixels, {
        fit: 'cover',
        withoutEnlargement: true,
      })
      .toBuffer();
  }

  async validate(imageData: Buffer): Promise<void> {
    try {
      await sharp(imageData).metadata();
    } catch {
      throw new Error('Invalid image data');
    }
  }
}
