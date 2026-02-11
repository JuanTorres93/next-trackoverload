import { FileSystemImagesRepo } from '../FileSystemImagesRepo';
import { createTestImage } from '../../../../../tests/helpers/imageTestHelpers';
import { ImageType } from '@/domain/repos/ImagesRepo.port';
import path from 'path';
import fs from 'fs/promises';
import os from 'os';

describe('FileSystemImagesRepo', () => {
  let imagesRepo: FileSystemImagesRepo;
  let testImage: ImageType;
  let testDir: string;

  beforeEach(async () => {
    // Create a temporary directory for tests
    testDir = path.join(os.tmpdir(), `images-repo-test-${Date.now()}`);
    imagesRepo = new FileSystemImagesRepo(testDir, '/test-images');

    const imageBuffer = await createTestImage();
    testImage = {
      buffer: imageBuffer,
      metadata: {
        url: 'http://example.com/image.jpg',
        filename: 'image.jpg',
        mimeType: 'image/jpeg',
        sizeBytes: imageBuffer.length,
      },
    };
  });

  afterEach(async () => {
    // Clean up test directory
    await imagesRepo.clearForTesting();
    try {
      await fs.rmdir(testDir);
    } catch {
      // Directory might not exist
    }
  });

  it('should save image', async () => {
    const count = await imagesRepo.countForTesting();
    expect(count).toBe(0);

    await imagesRepo.save(testImage);

    const newCount = await imagesRepo.countForTesting();
    expect(newCount).toBe(1);
  });

  it('should delete image by url', async () => {
    const savedMetadata = await imagesRepo.save(testImage);
    let count = await imagesRepo.countForTesting();
    expect(count).toBe(1);

    await imagesRepo.deleteByUrl(savedMetadata.url);

    count = await imagesRepo.countForTesting();
    expect(count).toBe(0);
  });

  it('should get image by url', async () => {
    const savedMetadata = await imagesRepo.save(testImage);
    const count = await imagesRepo.countForTesting();
    expect(count).toBe(1);

    const retrievedMetadata = await imagesRepo.getByUrl(savedMetadata.url);

    expect(retrievedMetadata).toEqual(savedMetadata);
  });

  it('should assign url', async () => {
    const newImageBuffer = await createTestImage();
    const newImage: ImageType = {
      buffer: newImageBuffer,
      metadata: {
        url: '',
        filename: 'new_image.jpg',
        mimeType: 'image/jpeg',
        sizeBytes: newImageBuffer.length,
      },
    };

    const savedMetadata = await imagesRepo.save(newImage);

    expect(savedMetadata.url).not.toBe('');
    expect(savedMetadata.url).toContain('/test-images/');
  });

  it('should return null for non-existent image', async () => {
    const metadata = await imagesRepo.getByUrl('/test-images/non-existent.jpg');

    expect(metadata).toBeNull();
  });

  it('should handle multiple images', async () => {
    const image1 = { ...testImage };
    const image2 = {
      ...testImage,
      metadata: { ...testImage.metadata, filename: 'image2.jpg' },
    };
    const image3 = {
      ...testImage,
      metadata: { ...testImage.metadata, filename: 'image3.jpg' },
    };

    await imagesRepo.save(image1);
    await imagesRepo.save(image2);
    await imagesRepo.save(image3);

    const count = await imagesRepo.countForTesting();
    expect(count).toBe(3);
  });

  it('should preserve image buffer content', async () => {
    const savedMetadata = await imagesRepo.save(testImage);

    const allImages = await imagesRepo.getAllForTesting();
    const savedImage = allImages.find(
      (img) => img.metadata.url === savedMetadata.url,
    );

    expect(savedImage).toBeDefined();
    expect(savedImage!.buffer).toEqual(testImage.buffer);
  });

  it('should handle deletion of non-existent image', async () => {
    // Should not throw
    await expect(
      imagesRepo.deleteByUrl('/test-images/non-existent.jpg'),
    ).resolves.not.toThrow();
  });

  it('should preserve metadata properties', async () => {
    const savedMetadata = await imagesRepo.save(testImage);

    expect(savedMetadata.mimeType).toBe(testImage.metadata.mimeType);
    expect(savedMetadata.sizeBytes).toBe(testImage.metadata.sizeBytes);
    expect(savedMetadata.filename).toContain('image');
    expect(savedMetadata.filename).toContain('.jpg');
  });
});
