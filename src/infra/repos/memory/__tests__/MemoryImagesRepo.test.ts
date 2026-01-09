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
  });
});
