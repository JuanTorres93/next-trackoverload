import { createTestImage } from '../../../../../tests/helpers/imageTestHelpers';
import { SharpImageProcessor } from '../SharpImageProcessor';

describe('SharpImageProcessor', () => {
  let imageProcessor: SharpImageProcessor;
  let validImageBuffer: Buffer;
  let invalidImageBuffer: Buffer;

  beforeAll(() => {
    imageProcessor = new SharpImageProcessor();

    validImageBuffer = createTestImage('large');
    invalidImageBuffer = Buffer.from('this is not a valid image');
  });

  describe('compress', () => {
    it('should compress a valid image buffer', async () => {
      const quality = 5;
      const compressedBuffer = await imageProcessor.compress(
        validImageBuffer,
        quality
      );

      expect(compressedBuffer).toBeInstanceOf(Buffer);
      expect(compressedBuffer.length).toBeLessThan(validImageBuffer.length);
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
