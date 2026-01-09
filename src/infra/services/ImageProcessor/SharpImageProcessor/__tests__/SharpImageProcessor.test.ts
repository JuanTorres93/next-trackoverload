import sharp from 'sharp';
import {
  createNonSquareTestImage,
  createTestImage,
} from '../../../../../../tests/helpers/imageTestHelpers';
import { SharpImageProcessor } from '../SharpImageProcessor';

describe('SharpImageProcessor', () => {
  let imageProcessor: SharpImageProcessor;
  let validImageBuffer: Buffer;
  let invalidImageBuffer: Buffer;

  beforeAll(async () => {
    imageProcessor = new SharpImageProcessor();

    validImageBuffer = await createTestImage('large');
    invalidImageBuffer = Buffer.from('this is not a valid image');
  });

  describe('compress', () => {
    it('should compress a valid image buffer', async () => {
      const intialSizeInMB = validImageBuffer.length / (1024 * 1024);

      const targetSizeInMB = intialSizeInMB / 2;
      const targetSizeInBytes = targetSizeInMB * 1024 * 1024;

      expect(validImageBuffer.length).toBeGreaterThan(targetSizeInBytes);

      const compressedBuffer = await imageProcessor.compressToMaxMB(
        validImageBuffer,
        targetSizeInMB
      );

      expect(compressedBuffer.length).toBeLessThanOrEqual(targetSizeInBytes);
    });
  });

  describe('resizeToSquare', () => {
    it('should resize a valid image buffer to a square of specified size', async () => {
      const nonSquareImageBuffer = await createNonSquareTestImage();

      const sizeInPixels = 50;

      const resizedBuffer = await imageProcessor.resizeToSquare(
        nonSquareImageBuffer,
        sizeInPixels
      );

      const metadata = await sharp(resizedBuffer).metadata();

      expect(metadata.width).toBe(sizeInPixels);
      expect(metadata.height).toBe(sizeInPixels);
    });
  });

  describe('validate', () => {
    it('should validate a valid image buffer without throwing', async () => {
      await expect(
        imageProcessor.validate(validImageBuffer)
      ).resolves.toBeUndefined();
    });

    it('should throw an error for an invalid image buffer', async () => {
      await expect(imageProcessor.validate(invalidImageBuffer)).rejects.toThrow(
        'Invalid image data'
      );
    });
  });
});
