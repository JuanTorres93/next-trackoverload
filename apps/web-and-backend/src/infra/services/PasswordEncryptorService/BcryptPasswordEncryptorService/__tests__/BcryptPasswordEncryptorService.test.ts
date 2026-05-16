import { BcryptPasswordEncryptorService } from '../BcryptPasswordEncryptorService';

describe('BcryptPasswordEncryptorService', () => {
  let service: BcryptPasswordEncryptorService;

  beforeEach(() => {
    service = new BcryptPasswordEncryptorService();
  });

  describe('constructor', () => {
    it('should create service with default salt rounds', () => {
      const defaultService = new BcryptPasswordEncryptorService();
      expect(defaultService).toBeInstanceOf(BcryptPasswordEncryptorService);
    });

    it('should create service with custom salt rounds', () => {
      const customService = new BcryptPasswordEncryptorService(10);
      expect(customService).toBeInstanceOf(BcryptPasswordEncryptorService);
    });

    it('should throw error if salt rounds is less than 10', () => {
      expect(() => new BcryptPasswordEncryptorService(9)).toThrow(
        'Salt rounds must be between 10 and 15 for security',
      );
    });

    it('should throw error if salt rounds is greater than 15', () => {
      expect(() => new BcryptPasswordEncryptorService(16)).toThrow(
        'Salt rounds must be between 10 and 15 for security',
      );
    });
  });

  describe('hashPassword', () => {
    it('should hash a plain password', async () => {
      const plainPassword = 'MySecurePassword123!';

      const hashedPassword = await service.hashPassword(plainPassword);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(plainPassword);
      expect(hashedPassword.length).toBeGreaterThan(50);
      expect(hashedPassword).toMatch(/^\$2[aby]\$.{56}$/);
    });

    it('should generate different hashes for the same password (different salts)', async () => {
      const plainPassword = 'MySecurePassword123!';

      const hash1 = await service.hashPassword(plainPassword);
      const hash2 = await service.hashPassword(plainPassword);

      expect(hash1).not.toBe(hash2);
    });

    it('should hash different passwords differently', async () => {
      const password1 = 'Password1!';
      const password2 = 'Password2!';

      const hash1 = await service.hashPassword(password1);
      const hash2 = await service.hashPassword(password2);

      expect(hash1).not.toBe(hash2);
    });

    it('should hash very long passwords', async () => {
      const longPassword = 'a'.repeat(100);

      const hashedPassword = await service.hashPassword(longPassword);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).toMatch(/^\$2[aby]\$.{56}$/);
    });

    it('should hash passwords with special characters', async () => {
      const specialPassword = '!@#$%^&*()_+-=[]{}|;:,.<>?';

      const hashedPassword = await service.hashPassword(specialPassword);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).toMatch(/^\$2[aby]\$.{56}$/);
    });
  });

  describe('plainPasswordMatchesHashed', () => {
    it('should return true for matching password and hash', async () => {
      const plainPassword = 'MySecurePassword123!';
      const hashedPassword = await service.hashPassword(plainPassword);

      const matches = await service.plainPasswordMatchesHashed(
        plainPassword,
        hashedPassword,
      );

      expect(matches).toBe(true);
    });

    it('should return false for non-matching password and hash', async () => {
      const plainPassword = 'MySecurePassword123!';
      const wrongPassword = 'WrongPassword123!';
      const hashedPassword = await service.hashPassword(plainPassword);

      const matches = await service.plainPasswordMatchesHashed(
        wrongPassword,
        hashedPassword,
      );

      expect(matches).toBe(false);
    });

    it('should verify passwords with special characters', async () => {
      const specialPassword = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const hashedPassword = await service.hashPassword(specialPassword);

      const matches = await service.plainPasswordMatchesHashed(
        specialPassword,
        hashedPassword,
      );

      expect(matches).toBe(true);
    });

    it('should be case-sensitive', async () => {
      const plainPassword = 'MySecurePassword123!';
      const uppercasePassword = 'MYSECUREPASSWORD123!';
      const hashedPassword = await service.hashPassword(plainPassword);

      const matches = await service.plainPasswordMatchesHashed(
        uppercasePassword,
        hashedPassword,
      );

      expect(matches).toBe(false);
    });
  });
});
