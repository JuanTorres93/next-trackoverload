import { Uuidv4IdGenerator } from '@/infra/services/IdGenerator/Uuidv4IdGenerator';
import { MemoryImageManager } from '../MemoryImageManager';

// Create a test image buffer (1x1 PNG)
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

describe('MemoryImageManager', () => {
  let imageManager: MemoryImageManager;

  beforeEach(() => {
    imageManager = new MemoryImageManager(
      '/memory/images',
      new Uuidv4IdGenerator()
    );
  });

  describe('uploadImage', () => {
    it('should upload a valid PNG image to memory', async () => {
      const testBuffer = createTestPngBuffer();
      const filename = 'test-image.png';

      const result = await imageManager.uploadImage(testBuffer, filename);

      expect(result).toBeDefined();
      expect(result.filename).toMatch(/test-image-.*\.png/);
      expect(result.url).toContain('/memory/images/');
      expect(result.mimeType).toBe('image/png');
      expect(result.sizeBytes).toBeGreaterThan(0);
      expect(result.width).toBe(1);
      expect(result.height).toBe(1);

      // Verify it's stored in memory
      expect(imageManager.getImageCount()).toBe(1);
    });

    it('should apply quality compression', async () => {
      const testBuffer = createTestPngBuffer();
      const filename = 'test-compressed.png';

      const result = await imageManager.uploadImage(testBuffer, filename);

      expect(result).toBeDefined();
      expect(result.mimeType).toBe('image/png');
      expect(imageManager.getImageCount()).toBe(1);
    });

    it('should throw error for invalid image data', async () => {
      const invalidBuffer = Buffer.from('not an image');
      const filename = 'invalid.png';

      await expect(
        imageManager.uploadImage(invalidBuffer, filename)
      ).rejects.toThrow('Invalid image');

      // Verify nothing was stored
      expect(imageManager.getImageCount()).toBe(0);
    });

    it('should handle filenames without extensions', async () => {
      const testBuffer = createTestPngBuffer();
      const filename = 'test-no-extension';

      const result = await imageManager.uploadImage(testBuffer, filename);

      expect(result.filename).toMatch(/test-no-extension-.*\.png/);
      expect(imageManager.getImageCount()).toBe(1);
    });
  });

  describe('getImageInfo', () => {
    it('should return image info for existing image', async () => {
      const testBuffer = createTestPngBuffer();
      const filename = 'info-test.png';

      const uploaded = await imageManager.uploadImage(testBuffer, filename);
      const info = await imageManager.getImageInfo(uploaded.url);

      expect(info).toBeDefined();
      expect(info!.mimeType).toBe('image/png');
      expect(info!.width).toBe(1);
      expect(info!.height).toBe(1);
      expect(info!.url).toBe(uploaded.url);
    });

    it('should return null for non-existent image', async () => {
      const fakeUrl = '/memory/images/non-existent.png';

      const info = await imageManager.getImageInfo(fakeUrl);

      expect(info).toBeNull();
    });
  });

  describe('deleteImage', () => {
    it('should delete an existing image', async () => {
      const testBuffer = createTestPngBuffer();
      const filename = 'delete-test.png';

      const uploaded = await imageManager.uploadImage(testBuffer, filename);
      expect(imageManager.getImageCount()).toBe(1);

      // Delete the image
      await imageManager.deleteImage(uploaded.url);

      // Verify it's deleted
      expect(imageManager.getImageCount()).toBe(0);
      const info = await imageManager.getImageInfo(uploaded.url);
      expect(info).toBeNull();
    });

    it('should not throw error when deleting non-existent image', async () => {
      const fakeUrl = '/memory/images/non-existent.png';

      await expect(imageManager.deleteImage(fakeUrl)).resolves.not.toThrow();
      expect(imageManager.getImageCount()).toBe(0);
    });
  });

  describe('getImageData', () => {
    it('should return image buffer for existing image', async () => {
      const testBuffer = createTestPngBuffer();
      const filename = 'data-test.png';

      const uploaded = await imageManager.uploadImage(testBuffer, filename);
      const retrievedData = imageManager.getImageData(uploaded.url);

      expect(retrievedData).toBeDefined();
      expect(Buffer.isBuffer(retrievedData)).toBe(true);
      expect(retrievedData!.length).toBeGreaterThan(0);
    });

    it('should return null for non-existent image', async () => {
      const fakeUrl = '/memory/images/non-existent.png';

      const data = imageManager.getImageData(fakeUrl);

      expect(data).toBeNull();
    });
  });

  describe('utility methods', () => {
    it('should track image count correctly', async () => {
      expect(imageManager.getImageCount()).toBe(0);

      const testBuffer = createTestPngBuffer();

      await imageManager.uploadImage(testBuffer, 'image1.png');
      expect(imageManager.getImageCount()).toBe(1);

      await imageManager.uploadImage(testBuffer, 'image2.png');
      expect(imageManager.getImageCount()).toBe(2);

      const allUrls = imageManager.getAllImageUrls();
      expect(allUrls).toHaveLength(2);
      expect(allUrls[0]).toContain('/memory/images/');
    });

    it('should clear all images', async () => {
      const testBuffer = createTestPngBuffer();

      await imageManager.uploadImage(testBuffer, 'image1.png');
      await imageManager.uploadImage(testBuffer, 'image2.png');
      expect(imageManager.getImageCount()).toBe(2);

      imageManager.clear();
      expect(imageManager.getImageCount()).toBe(0);
      expect(imageManager.getAllImageUrls()).toHaveLength(0);
    });
  });

  describe('validation (inherited from BaseImageManager)', () => {
    it('should validate image using inherited method', async () => {
      const testBuffer = createTestPngBuffer();

      const result = await imageManager.validateImage(testBuffer);

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });
  });
});
