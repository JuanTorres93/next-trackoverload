// Load env variables for real Cloudinary API calls
import 'dotenv/config';

import { beforeEach, describe, expect, it } from 'vitest';
import { CloudinaryImagesRepo } from '../CloudinaryImagesRepo';

describe('CloudinaryImagesRepo', () => {
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
});
