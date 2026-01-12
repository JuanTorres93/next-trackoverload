import { ImageType } from '@/domain/repos/ImagesRepo.port';
import sharp from 'sharp';

export const createTestImage = async (
  size: 'small' | 'large' = 'small'
): Promise<Buffer> => {
  if (size === 'small') {
    // Generate a 10x10 PNG image
    return sharp({
      create: {
        width: 10,
        height: 10,
        channels: 4,
        background: { r: 255, g: 0, b: 0, alpha: 1 },
      },
    })
      .png()
      .toBuffer();
  }

  // Generate a larger 1000x1000 PNG image for size limit testing
  return sharp({
    create: {
      width: 1000,
      height: 1000,
      channels: 4,
      background: { r: 0, g: 0, b: 255, alpha: 1 },
    },
  })
    .png()
    .toBuffer();
};

export const createNonSquareTestImage = async (): Promise<Buffer> => {
  // Generate a 200x100 PNG image (2:1 ratio)
  return sharp({
    create: {
      width: 200,
      height: 100,
      channels: 4,
      background: { r: 0, g: 255, b: 0, alpha: 1 },
    },
  })
    .png()
    .toBuffer();
};

export const createFakeMetadata = (): ImageType['metadata'] => {
  return {
    url: 'http://example.com/test-image.png',
    filename: 'test-image.png',
    mimeType: 'image/png',
    sizeBytes: 2048,
  };
};
