/**
 * Example test helper for using MemoryImageManager in use case tests
 *
 * This shows how to use MemoryImageManager instead of FileSystemImageManager
 * for faster, isolated tests that don't touch the file system.
 */

import { MemoryImageManager } from '@/infra/memory/MemoryImageManager';

// Create a test-specific instance
export const createTestImageManager = () => {
  return new MemoryImageManager('/test/images');
};

// Helper to create test image buffers
export const createTestImage = (size: 'small' | 'large' = 'small'): Buffer => {
  // Small 1x1 PNG
  if (size === 'small') {
    return Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
      0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
      0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
      0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
    ]);
  }

  // Larger image (repeat the small one multiple times for testing size limits)
  const smallImage = createTestImage('small');
  return Buffer.concat(Array(1000).fill(smallImage));
};

// Example usage in a test:
//
// describe('CreateRecipeUsecase', () => {
//   let imageManager: MemoryImageManager;
//
//   beforeEach(() => {
//     imageManager = createTestImageManager();
//   });
//
//   afterEach(() => {
//     imageManager.clear(); // Clean up
//   });
//
//   it('should create recipe with image', async () => {
//     const testImage = createTestImage('small');
//     const uploadedImage = await imageManager.uploadImage(testImage, 'recipe.png');
//
//     // Use uploadedImage.url in your recipe creation test
//     // ...
//   });
// });
