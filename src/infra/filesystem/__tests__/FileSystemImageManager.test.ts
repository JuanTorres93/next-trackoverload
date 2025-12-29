import { Uuidv4IdGenerator } from '@/infra/services/IdGenerator/Uuidv4IdGenerator';
import { FileSystemImageManager } from '../FileSystemImageManager';
import fs from 'fs/promises';
import path from 'path';

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

describe('FileSystemImageManager', () => {
  let imageManager: FileSystemImageManager;
  const testDir = './__test_data__/filesystem_images';

  beforeEach(async () => {
    imageManager = new FileSystemImageManager(
      testDir,
      '/test-images',
      new Uuidv4IdGenerator()
    );
  });

  afterEach(async () => {
    // Clean up test directory
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch {
      // Directory might not exist
    }
  });

  describe('uploadImage', () => {
    it('should upload a valid PNG image to filesystem', async () => {
      const testBuffer = createTestPngBuffer();
      const filename = 'test-image.png';

      const result = await imageManager.uploadImage(testBuffer, filename);

      expect(result).toBeDefined();
      expect(result.filename).toMatch(/test-image-.*\.png/);
      expect(result.url).toContain('/test-images/');
      expect(result.mimeType).toBe('image/png');
      expect(result.sizeBytes).toBeGreaterThan(0);
      expect(result.width).toBe(1);
      expect(result.height).toBe(1);

      // Verify file exists on disk
      const imageCount = await imageManager.getImageCount();
      expect(imageCount).toBe(1);

      // Verify file physically exists
      const filePath = path.join(testDir, result.filename);
      const fileExists = await fs
        .access(filePath)
        .then(() => true)
        .catch(() => false);
      expect(fileExists).toBe(true);
    });

    it('should apply quality compression', async () => {
      const testBuffer = createTestPngBuffer();
      const filename = 'test-compressed.png';
      const options = { quality: 0.5 };

      const result = await imageManager.uploadImage(
        testBuffer,
        filename,
        options
      );

      expect(result).toBeDefined();
      expect(result.mimeType).toBe('image/png');

      const imageCount = await imageManager.getImageCount();
      expect(imageCount).toBe(1);
    });

    it('should throw error for invalid image data', async () => {
      const invalidBuffer = Buffer.from('not an image');
      const filename = 'invalid.png';

      await expect(
        imageManager.uploadImage(invalidBuffer, filename)
      ).rejects.toThrow('Invalid image');

      // Verify nothing was stored
      const imageCount = await imageManager.getImageCount();
      expect(imageCount).toBe(0);
    });

    it('should handle filenames without extensions', async () => {
      const testBuffer = createTestPngBuffer();
      const filename = 'test-no-extension';

      const result = await imageManager.uploadImage(testBuffer, filename);

      expect(result.filename).toMatch(/test-no-extension-.*\.png/);

      const imageCount = await imageManager.getImageCount();
      expect(imageCount).toBe(1);
    });

    it('should create upload directory if it does not exist', async () => {
      // Ensure directory doesn't exist
      try {
        await fs.rm(testDir, { recursive: true, force: true });
      } catch {
        // Ignore
      }

      const testBuffer = createTestPngBuffer();
      const filename = 'test-create-dir.png';

      const result = await imageManager.uploadImage(testBuffer, filename);

      expect(result).toBeDefined();

      // Verify directory was created
      const dirExists = await fs
        .access(testDir)
        .then(() => true)
        .catch(() => false);
      expect(dirExists).toBe(true);
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
      const fakeUrl = '/test-images/non-existent.png';

      const info = await imageManager.getImageInfo(fakeUrl);

      expect(info).toBeNull();
    });
  });

  describe('deleteImage', () => {
    it('should delete an existing image', async () => {
      const testBuffer = createTestPngBuffer();
      const filename = 'delete-test.png';

      const uploaded = await imageManager.uploadImage(testBuffer, filename);

      let imageCount = await imageManager.getImageCount();
      expect(imageCount).toBe(1);

      // Delete the image
      await imageManager.deleteImage(uploaded.url);

      // Verify it's deleted
      imageCount = await imageManager.getImageCount();
      expect(imageCount).toBe(0);

      const info = await imageManager.getImageInfo(uploaded.url);
      expect(info).toBeNull();

      // Verify file no longer exists on disk
      const filePath = path.join(testDir, uploaded.filename);
      const fileExists = await fs
        .access(filePath)
        .then(() => true)
        .catch(() => false);
      expect(fileExists).toBe(false);
    });

    it('should not throw error when deleting non-existent image', async () => {
      const fakeUrl = '/test-images/non-existent.png';

      await expect(imageManager.deleteImage(fakeUrl)).resolves.not.toThrow();

      const imageCount = await imageManager.getImageCount();
      expect(imageCount).toBe(0);
    });
  });

  describe('getImageData', () => {
    it('should return image buffer for existing image', async () => {
      const testBuffer = createTestPngBuffer();
      const filename = 'data-test.png';

      const uploaded = await imageManager.uploadImage(testBuffer, filename);
      const retrievedData = await imageManager.getImageData(uploaded.url);

      expect(retrievedData).toBeDefined();
      expect(Buffer.isBuffer(retrievedData)).toBe(true);
      expect(retrievedData!.length).toBeGreaterThan(0);
    });

    it('should return null for non-existent image', async () => {
      const fakeUrl = '/test-images/non-existent.png';

      const data = await imageManager.getImageData(fakeUrl);

      expect(data).toBeNull();
    });
  });

  describe('utility methods', () => {
    it('should track image count correctly', async () => {
      let count = await imageManager.getImageCount();
      expect(count).toBe(0);

      const testBuffer = createTestPngBuffer();

      await imageManager.uploadImage(testBuffer, 'image1.png');
      count = await imageManager.getImageCount();
      expect(count).toBe(1);

      await imageManager.uploadImage(testBuffer, 'image2.png');
      count = await imageManager.getImageCount();
      expect(count).toBe(2);

      const allUrls = await imageManager.getAllImageUrls();
      expect(allUrls).toHaveLength(2);
      expect(allUrls[0]).toContain('/test-images/');
    });

    it('should clear all images', async () => {
      const testBuffer = createTestPngBuffer();

      await imageManager.uploadImage(testBuffer, 'image1.png');
      await imageManager.uploadImage(testBuffer, 'image2.png');

      let count = await imageManager.getImageCount();
      expect(count).toBe(2);

      await imageManager.clear();

      count = await imageManager.getImageCount();
      expect(count).toBe(0);

      const urls = await imageManager.getAllImageUrls();
      expect(urls).toHaveLength(0);
    });
  });

  describe('validation (inherited from BaseImageManager)', () => {
    it('should validate image using inherited method', async () => {
      const testBuffer = createTestPngBuffer();

      const result = await imageManager.validateImage(testBuffer);

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should respect MIME type restrictions', async () => {
      const testBuffer = createTestPngBuffer();
      const options = { allowedMimeTypes: ['image/jpeg'] };

      await expect(
        imageManager.uploadImage(testBuffer, 'test.png', options)
      ).rejects.toThrow('Invalid image');

      const imageCount = await imageManager.getImageCount();
      expect(imageCount).toBe(0);
    });
  });

  describe('persistence', () => {
    it('should persist images across manager instances', async () => {
      const testBuffer = createTestPngBuffer();
      const filename = 'persistent-image.png';

      // Upload with first instance
      const result = await imageManager.uploadImage(testBuffer, filename);

      // Create new instance pointing to same directory
      const newManager = new FileSystemImageManager(
        testDir,
        '/test-images',
        new Uuidv4IdGenerator()
      );

      // Should be able to retrieve the image
      const info = await newManager.getImageInfo(result.url);
      expect(info).toBeDefined();
      expect(info!.filename).toBe(result.filename);

      const count = await newManager.getImageCount();
      expect(count).toBe(1);
    });
  });
});
