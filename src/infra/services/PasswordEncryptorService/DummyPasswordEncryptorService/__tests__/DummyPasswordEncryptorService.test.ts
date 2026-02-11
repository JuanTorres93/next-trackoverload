import { describe, it, expect, beforeEach } from 'vitest';
import { DummyPasswordEncryptorService } from '../DummyPasswordEncryptorService';

describe('DummyPasswordEncryptorService', () => {
  let service: DummyPasswordEncryptorService;

  beforeEach(() => {
    service = new DummyPasswordEncryptorService();
  });

  describe('hashPassword', () => {
    it('should hash a plain password', async () => {
      const plainPassword = 'myPassword123';
      const hashed = await service.hashPassword(plainPassword);

      expect(hashed).toBeDefined();
      expect(typeof hashed).toBe('string');
      expect(hashed).not.toBe(plainPassword);
    });

    it('should return different hash than the plain password', async () => {
      const plainPassword = 'myPassword123';
      const hashed = await service.hashPassword(plainPassword);

      expect(hashed).not.toBe(plainPassword);
    });

    it('should produce different hashes for different passwords', async () => {
      const hashed1 = await service.hashPassword('password1');
      const hashed2 = await service.hashPassword('password2');

      expect(hashed1).not.toBe(hashed2);
    });
  });

  describe('plainPasswordMatchesHashed', () => {
    it('should return true when plain password matches hashed password', async () => {
      const plainPassword = 'myPassword123';
      const hashed = await service.hashPassword(plainPassword);
      const matches = await service.plainPasswordMatchesHashed(
        plainPassword,
        hashed,
      );

      expect(matches).toBe(true);
    });

    it('should return false when plain password does not match hashed password', async () => {
      const plainPassword = 'myPassword123';
      const wrongPassword = 'wrongPassword';
      const hashed = await service.hashPassword(plainPassword);
      const matches = await service.plainPasswordMatchesHashed(
        wrongPassword,
        hashed,
      );

      expect(matches).toBe(false);
    });

    it('should return false for empty password against non-empty hash', async () => {
      const plainPassword = 'myPassword123';
      const hashed = await service.hashPassword(plainPassword);
      const matches = await service.plainPasswordMatchesHashed('', hashed);

      expect(matches).toBe(false);
    });

    it('should handle case sensitivity correctly', async () => {
      const plainPassword = 'MyPassword123';
      const hashed = await service.hashPassword(plainPassword);
      const matches = await service.plainPasswordMatchesHashed(
        'mypassword123',
        hashed,
      );

      expect(matches).toBe(false);
    });
  });
});
