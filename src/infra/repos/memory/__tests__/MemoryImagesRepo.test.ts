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

  it('should duplicate image by url', async () => {
    const savedMetadata = await imagesRepo.save(testImage);
    expect(imagesRepo.countForTesting()).toBe(1);

    const newFilename = 'image-copy.jpg';
    const newUrl = imagesRepo.generateUrl(newFilename);
    const duplicatedMetadata = await imagesRepo.duplicateByUrl(
      savedMetadata.url,
      newFilename,
      newUrl
    );

    expect(imagesRepo.countForTesting()).toBe(2);
    expect(duplicatedMetadata.url).not.toBe(savedMetadata.url);
    expect(duplicatedMetadata.filename).not.toBe(savedMetadata.filename);
    expect(duplicatedMetadata.filename).toContain('copy');
    expect(duplicatedMetadata.mimeType).toBe(savedMetadata.mimeType);
    expect(duplicatedMetadata.sizeBytes).toBe(savedMetadata.sizeBytes);

    // Verify both images exist
    const original = await imagesRepo.getByUrl(savedMetadata.url);
    const duplicate = await imagesRepo.getByUrl(duplicatedMetadata.url);
    expect(original).toEqual(savedMetadata);
    expect(duplicate).toEqual(duplicatedMetadata);

    // Verify buffer was duplicated
    const allImages = imagesRepo.getAllForTesting();
    const originalImage = allImages.find(
      (img) => img.metadata.url === savedMetadata.url
    );
    const duplicatedImage = allImages.find(
      (img) => img.metadata.url === duplicatedMetadata.url
    );
    expect(originalImage?.buffer).toEqual(duplicatedImage?.buffer);
  });

  it('should throw error when duplicating non-existent image', async () => {
    const newFilename = 'copy.jpg';
    const newUrl = imagesRepo.generateUrl(newFilename);
    await expect(
      imagesRepo.duplicateByUrl(
        'memory://image/non-existent.jpg',
        newFilename,
        newUrl
      )
    ).rejects.toThrow('not found');
  });
});
