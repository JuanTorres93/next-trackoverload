import sharp from 'sharp';

import { ImageProcessor } from '../../../../domain/services/ImageProcessor/ImageProcessor.port.js';
import {
  MAX_MB,
  SQUARE_IMAGE_SIZE_PIXELS,
} from '@/domain/services/ImageProcessor/Config.js';

export class SharpImageProcessor implements ImageProcessor {
  async compressToMaxMB(
    imageData: Buffer,
    maxSizeMB: number = MAX_MB,
  ): Promise<Buffer> {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    let minQuality = 1;
    let maxQuality = 100;
    const qualityStep = 5;

    let bestCandidate: Buffer | null = null;

    while (minQuality <= maxQuality) {
      const quality = Math.floor((minQuality + maxQuality) / 2);

      const output = await sharp(imageData)
        .jpeg({ quality, mozjpeg: true })
        .toBuffer();

      const currentSizeInBytes = output.length;

      if (currentSizeInBytes <= maxSizeBytes) {
        // Valid, try to increase quality
        bestCandidate = output;
        minQuality = quality + qualityStep;
      } else {
        // Too large, decrease quality
        maxQuality = quality - qualityStep;
      }
    }

    return (
      bestCandidate ??
      sharp(imageData).jpeg({ quality: 10, mozjpeg: true }).toBuffer()
    );
  }

  resizeToSquare(
    imageData: Buffer,
    sizeInPixels: number = SQUARE_IMAGE_SIZE_PIXELS,
  ): Promise<Buffer> {
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
