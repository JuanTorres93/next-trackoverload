import { describe, it, expect, beforeEach } from 'vitest';
import { GetImageByUrlUsecase } from '../GetImageByUrl.usecase';
import { MemoryImageManager } from '@/infra/memory/MemoryImageManager';
import { NotFoundError } from '@/domain/common/errors';

// Helper to create test image buffer (1x1 PNG)
const createTestPngBuffer = (): Buffer => {
  return Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
    0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
    0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
  ]);
};

describe('GetImageByUrlUsecase', () => {
  let imageManager: MemoryImageManager;
  let usecase: GetImageByUrlUsecase;

  beforeEach(() => {
    imageManager = new MemoryImageManager();
    usecase = new GetImageByUrlUsecase(imageManager);
  });

  describe('execute', () => {
    it('should return image buffer and metadata for existing image', async () => {
      // Arrange
      const testBuffer = createTestPngBuffer();
      const filename = 'test-image.png';

      const uploadedImage = await imageManager.uploadImage(
        testBuffer,
        filename
      );

      // Act
      const result = await usecase.execute({ imageUrl: uploadedImage.url });

      // Assert
      expect(result).toBeDefined();
      expect(Buffer.isBuffer(result.imageBuffer)).toBe(true);
      expect(result.imageBuffer.length).toBeGreaterThan(0);
      expect(result.mimeType).toBe('image/png');
      expect(result.filename).toMatch(/test-image-.*\.png/);
      expect(result.sizeBytes).toBeGreaterThan(0);
    });

    it('should throw NotFoundError for non-existent image', async () => {
      // Arrange
      const nonExistentUrl = '/memory/images/non-existent.png';

      // Act & Assert
      await expect(
        usecase.execute({ imageUrl: nonExistentUrl })
      ).rejects.toThrow(NotFoundError);

      await expect(
        usecase.execute({ imageUrl: nonExistentUrl })
      ).rejects.toThrow('Image not found: /memory/images/non-existent.png');
    });

    it('should throw error for empty imageUrl', async () => {
      // Act & Assert
      await expect(usecase.execute({ imageUrl: '' })).rejects.toThrow(
        'GetImageByUrl imageUrl: Invalid string'
      );
    });

    it('should throw error for invalid imageUrl', async () => {
      // Act & Assert
      await expect(usecase.execute({ imageUrl: '   ' })).rejects.toThrow(
        'GetImageByUrl imageUrl: Invalid string'
      );
    });

    it('should return correct metadata when imageInfo is available', async () => {
      // Arrange
      const testBuffer = createTestPngBuffer();
      const filename = 'metadata-test.png';

      const uploadedImage = await imageManager.uploadImage(
        testBuffer,
        filename
      );

      // Act
      const result = await usecase.execute({ imageUrl: uploadedImage.url });

      // Assert
      expect(result.mimeType).toBe(uploadedImage.mimeType);
      expect(result.filename).toBe(uploadedImage.filename);
      expect(result.sizeBytes).toBe(uploadedImage.sizeBytes);
    });

    it('should fallback to default values when imageInfo is not available', async () => {
      // Arrange - Upload image then clear metadata (simulate partial failure)
      const testBuffer = createTestPngBuffer();
      const filename = 'fallback-test.png';

      const uploadedImage = await imageManager.uploadImage(
        testBuffer,
        filename
      );

      // Mock getImageInfo to return null
      const originalGetImageInfo = imageManager.getImageInfo;
      imageManager.getImageInfo = async () => null;

      // Act
      const result = await usecase.execute({ imageUrl: uploadedImage.url });

      // Assert
      expect(result.mimeType).toBe('application/octet-stream');
      expect(result.filename).toBe('unknown');
      expect(result.sizeBytes).toBe(result.imageBuffer.length);

      // Restore original method
      imageManager.getImageInfo = originalGetImageInfo;
    });
  });
});
