// Load env variables for real Cloudinary API calls
import 'dotenv/config';

import { ImageType } from '@/domain/repos/ImagesRepo.port';
import { beforeEach, describe, expect, it } from 'vitest';
import { createTestImage } from '../../../../../../tests/helpers/imageTestHelpers';
import { CloudinaryImagesRepo } from '../CloudinaryImagesRepo';

// Check if Cloudinary credentials are available
const hasCloudinaryCredentials = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET,
);

// Skip tests in CI/CD if credentials are not available
// In local development, tests will run and fail if credentials are missing
const isCI = Boolean(process.env.CI || process.env.GITHUB_ACTIONS);
const shouldSkip = isCI && !hasCloudinaryCredentials;

describe.skipIf(shouldSkip)('CloudinaryImagesRepo', () => {
  let repo: CloudinaryImagesRepo;

  beforeEach(() => {
    repo = new CloudinaryImagesRepo();
  });

  describe('generateUrl', () => {
    it('should generate a URL for a given filename', () => {
      const filename = 'test-image.jpg';

      const generatedUrl = repo.generateUrl(filename);

      expect(generatedUrl).toContain('https://res.cloudinary.com/');
      expect(generatedUrl).toContain('test-image');
    });

    it('should handle filenames with multiple dots correctly', () => {
      const filename = 'my.test.image.jpeg';

      const generatedUrl = repo.generateUrl(filename);

      expect(generatedUrl).toContain('https://res.cloudinary.com/');
      expect(generatedUrl).toContain('my.test.image');
    });

    it('should handle filenames without extension', () => {
      const filename = 'my-image';

      const generatedUrl = repo.generateUrl(filename);
      expect(generatedUrl).toContain('https://res.cloudinary.com/');
      expect(generatedUrl).toContain('my-image');
    });
  });

  describe('save', () => {
    it('should upload an image to Cloudinary and return metadata', async () => {
      const buffer = await createTestImage('small');
      const image: ImageType = {
        buffer,
        metadata: {
          url: '',
          filename: 'test-upload.png',
          mimeType: 'image/png',
          sizeBytes: buffer.length,
        },
      };

      const result = await repo.save(image);

      expect(result).toBeDefined();
      expect(result.url).toContain('https://res.cloudinary.com/');
      expect(result.url).toContain('test-upload');
      expect(result.filename).toBe('test-upload.png');
      expect(result.mimeType).toBe('image/png');
      expect(result.sizeBytes).toBeGreaterThan(0);

      // Cleanup: delete the uploaded image
      await repo.deleteByUrl(result.url);
    });

    it('should handle different image formats', async () => {
      const buffer = await createTestImage('small');
      const image: ImageType = {
        buffer,
        metadata: {
          url: '',
          filename: 'test-jpeg.jpg',
          mimeType: 'image/jpeg',
          sizeBytes: buffer.length,
        },
      };

      const result = await repo.save(image);

      expect(result).toBeDefined();
      expect(result.url).toContain('https://res.cloudinary.com/');
      expect(result.filename).toBe('test-jpeg.jpg');
      expect(result.mimeType).toBe('image/jpeg');

      // Cleanup
      await repo.deleteByUrl(result.url);
    });
  });

  describe('needs updated image', () => {
    let image: ImageType;
    let uploadedMetadata: ImageType['metadata'];

    beforeEach(async () => {
      const buffer = await createTestImage('small');
      image = {
        buffer,
        metadata: {
          url: '',
          filename: 'test.png',
          mimeType: 'image/png',
          sizeBytes: buffer.length,
        },
      };
      uploadedMetadata = await repo.save(image);
    });

    afterEach(async () => {
      await repo.deleteByUrl(uploadedMetadata.url);
    });

    describe('deleteByUrl', () => {
      it('should delete an uploaded image by URL', async () => {
        expect(uploadedMetadata.url).toBeDefined();

        // Delete the image
        await repo.deleteByUrl(uploadedMetadata.url);

        // Verify deletion by trying to get it
        const retrievedMetadata = await repo.getByUrl(uploadedMetadata.url);
        expect(retrievedMetadata).toBeNull();
      });

      it('should not throw when deleting a non-existent image', async () => {
        const nonExistentUrl =
          'https://res.cloudinary.com/demo/image/upload/non-existent-image.png';

        // Should not throw
        await expect(repo.deleteByUrl(nonExistentUrl)).resolves.not.toThrow();
      });
    });

    describe('getByUrl', () => {
      it('should retrieve metadata for an existing image', async () => {
        const retrievedMetadata = await repo.getByUrl(uploadedMetadata.url);

        expect(retrievedMetadata).toBeDefined();
        expect(retrievedMetadata).not.toBeNull();
        expect(retrievedMetadata?.url).toContain('https://res.cloudinary.com/');
        expect(retrievedMetadata?.url).toContain('test');
        expect(retrievedMetadata?.mimeType).toContain('image/');
        expect(retrievedMetadata?.sizeBytes).toBeGreaterThan(0);
      });

      it('should return null for a non-existent image', async () => {
        const nonExistentUrl =
          'https://res.cloudinary.com/demo/image/upload/non-existent-image-12345.png';

        const result = await repo.getByUrl(nonExistentUrl);

        expect(result).toBeNull();
      });

      it('should return metadata matching the uploaded image', async () => {
        // Get metadata and compare
        const retrievedMetadata = await repo.getByUrl(uploadedMetadata.url);

        expect(retrievedMetadata).toBeDefined();
        expect(retrievedMetadata?.url).toBe(uploadedMetadata.url);
        expect(retrievedMetadata?.sizeBytes).toBe(uploadedMetadata.sizeBytes);
      });
    });
  });
});
