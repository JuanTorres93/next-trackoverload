import { MemoryImagesRepo } from '../MemoryImagesRepo';
import { createTestImage } from '../../../../../tests/helpers/imageTestHelpers';
import { ImageType } from '@/domain/repos/ImagesRepo.port';

describe('MemoryImagesRepo', () => {
  let imagesRepo: MemoryImagesRepo;
  let testImage: ImageType;

  beforeEach(async () => {
    imagesRepo = new MemoryImagesRepo();

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

  it('should save image', async () => {
    expect(imagesRepo.countForTesting()).toBe(0);

    await imagesRepo.save(testImage);

    expect(imagesRepo.countForTesting()).toBe(1);
  });

  it('should delete image by url', async () => {
    await imagesRepo.save(testImage);
    expect(imagesRepo.countForTesting()).toBe(1);

    await imagesRepo.deleteByUrl(testImage.metadata.url);

    expect(imagesRepo.countForTesting()).toBe(0);
  });

  it('should get image by url', async () => {
    await imagesRepo.save(testImage);
    expect(imagesRepo.countForTesting()).toBe(1);

    const retrievedImage = await imagesRepo.getByUrl(testImage.metadata.url);

    expect(retrievedImage).toEqual(testImage.metadata);
  });

  describe('duplicateByUrl', () => {
    it('should duplicate an existing image', async () => {
      await imagesRepo.save(testImage);
      expect(imagesRepo.countForTesting()).toBe(1);

      const duplicatedMetadata = await imagesRepo.duplicateByUrl(
        testImage.metadata.url,
      );

      expect(imagesRepo.countForTesting()).toBe(2);
      expect(duplicatedMetadata).toBeDefined();
      expect(duplicatedMetadata.url).not.toBe(testImage.metadata.url);
      expect(duplicatedMetadata.filename).not.toBe(testImage.metadata.filename);
      expect(duplicatedMetadata.mimeType).toBe(testImage.metadata.mimeType);
      expect(duplicatedMetadata.sizeBytes).toBe(testImage.metadata.sizeBytes);
    });

    it('should throw error when duplicating non-existent image', async () => {
      await expect(
        imagesRepo.duplicateByUrl('non-existent-url'),
      ).rejects.toThrow('Image not found');
    });

    it('should create independent copy with same buffer content', async () => {
      await imagesRepo.save(testImage);
      const duplicatedMetadata = await imagesRepo.duplicateByUrl(
        testImage.metadata.url,
      );

      const allImages = imagesRepo.getAllForTesting();
      const original = allImages.find(
        (img) => img.metadata.url === testImage.metadata.url,
      );
      const duplicate = allImages.find(
        (img) => img.metadata.url === duplicatedMetadata.url,
      );

      expect(original?.buffer).toEqual(duplicate?.buffer);
    });

    it('should allow deletion of duplicated image without affecting original', async () => {
      await imagesRepo.save(testImage);
      const duplicatedMetadata = await imagesRepo.duplicateByUrl(
        testImage.metadata.url,
      );

      await imagesRepo.deleteByUrl(duplicatedMetadata.url);

      expect(imagesRepo.countForTesting()).toBe(1);
      const original = await imagesRepo.getByUrl(testImage.metadata.url);
      expect(original).toBeDefined();
    });
  });
});
