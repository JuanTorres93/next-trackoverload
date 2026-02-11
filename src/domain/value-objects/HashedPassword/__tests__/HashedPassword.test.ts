import { ValidationError } from '@/domain/common/errors';
import { HashedPassword } from '../HashedPassword';

describe('HashedPassword', () => {
  describe('Valid hashed passwords', () => {
    it('should create a valid HashedPassword with a bcrypt-like hash', () => {
      const hashValue =
        '$2b$10$rI7Qo3.7fZFQZQYQXYQXeOzQ7fZFQZQYQXYQXeOzQ7fZFQZQYQXYQXe';

      const hashedPassword = HashedPassword.create(hashValue);

      expect(hashedPassword).toBeInstanceOf(HashedPassword);
      expect(hashedPassword.value).toBe(hashValue);
    });

    it('should create a valid HashedPassword with an argon2-like hash', () => {
      const hashValue =
        '$argon2id$v=19$m=65536,t=2,p=1$c29tZXNhbHQ$MTIzNDU2Nzg5MGFiY2RlZg';

      const hashedPassword = HashedPassword.create(hashValue);

      expect(hashedPassword).toBeInstanceOf(HashedPassword);
      expect(hashedPassword.value).toBe(hashValue);
    });

    it('should create a valid HashedPassword with any reasonable length string', () => {
      const hashValue = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';

      const hashedPassword = HashedPassword.create(hashValue);

      expect(hashedPassword).toBeInstanceOf(HashedPassword);
      expect(hashedPassword.value).toBe(hashValue);
    });

    it('should trim whitespace from hashed password value', () => {
      const hashValue =
        '   $2b$10$rI7Qo3.7fZFQZQYQXYQXeOzQ7fZFQZQYQXYQXeOzQ7fZFQZQYQXYQXe   ';
      const trimmedValue =
        '$2b$10$rI7Qo3.7fZFQZQYQXYQXeOzQ7fZFQZQYQXYQXeOzQ7fZFQZQYQXYQXe';

      const hashedPassword = HashedPassword.create(hashValue);

      expect(hashedPassword.value).toBe(trimmedValue);
    });

    it('should accept hash with exactly 10 characters', () => {
      const hashValue = '0123456789';

      const hashedPassword = HashedPassword.create(hashValue);

      expect(hashedPassword).toBeInstanceOf(HashedPassword);
      expect(hashedPassword.value).toBe(hashValue);
    });
  });

  describe('Invalid hashed passwords - type validation', () => {
    it('should throw validation error if value is not a string', () => {
      // @ts-expect-error testing invalid input
      expect(() => HashedPassword.create(123)).toThrow(ValidationError);
      // @ts-expect-error testing invalid input
      expect(() => HashedPassword.create(123)).toThrow(/string/);
    });

    it('should throw validation error if value is null', () => {
      // @ts-expect-error testing invalid input
      expect(() => HashedPassword.create(null)).toThrow(ValidationError);
      // @ts-expect-error testing invalid input
      expect(() => HashedPassword.create(null)).toThrow(/string/);
    });

    it('should throw validation error if value is undefined', () => {
      // @ts-expect-error testing invalid input
      expect(() => HashedPassword.create(undefined)).toThrow(ValidationError);
      // @ts-expect-error testing invalid input
      expect(() => HashedPassword.create(undefined)).toThrow(/string/);
    });

    it('should throw validation error if value is empty', () => {
      expect(() => HashedPassword.create('')).toThrow(ValidationError);
      expect(() => HashedPassword.create('')).toThrow(/cannot be empty/);
    });

    it('should throw validation error if value is only whitespace', () => {
      expect(() => HashedPassword.create('   ')).toThrow(ValidationError);
      expect(() => HashedPassword.create('   ')).toThrow(/cannot be empty/);
    });
  });

  describe('Invalid hashed passwords - length validation', () => {
    it('should throw validation error if value is too short', () => {
      const shortHash = 'abc123';

      expect(() => HashedPassword.create(shortHash)).toThrow(ValidationError);
      expect(() => HashedPassword.create(shortHash)).toThrow(/too short/);
    });

    it('should throw validation error if value is 9 characters', () => {
      const shortHash = '123456789';

      expect(() => HashedPassword.create(shortHash)).toThrow(ValidationError);
      expect(() => HashedPassword.create(shortHash)).toThrow(/too short/);
    });

    it('should throw validation error for single character', () => {
      const shortHash = 'a';

      expect(() => HashedPassword.create(shortHash)).toThrow(ValidationError);
      expect(() => HashedPassword.create(shortHash)).toThrow(/too short/);
    });
  });

  describe('HashedPassword equality', () => {
    it('should return true for equal hashed passwords', () => {
      const hashValue =
        '$2b$10$rI7Qo3.7fZFQZQYQXYQXeOzQ7fZFQZQYQXYQXeOzQ7fZFQZQYQXYQXe';
      const hashedPassword1 = HashedPassword.create(hashValue);
      const hashedPassword2 = HashedPassword.create(hashValue);

      expect(hashedPassword1.equals(hashedPassword2)).toBe(true);
    });

    it('should return false for different hashed passwords', () => {
      const hashValue1 =
        '$2b$10$rI7Qo3.7fZFQZQYQXYQXeOzQ7fZFQZQYQXYQXeOzQ7fZFQZQYQXYQXe';
      const hashValue2 =
        '$2b$10$differentHashValueHereXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
      const hashedPassword1 = HashedPassword.create(hashValue1);
      const hashedPassword2 = HashedPassword.create(hashValue2);

      expect(hashedPassword1.equals(hashedPassword2)).toBe(false);
    });

    it('should return false when comparing with undefined', () => {
      const hashValue =
        '$2b$10$rI7Qo3.7fZFQZQYQXYQXeOzQ7fZFQZQYQXYQXeOzQ7fZFQZQYQXYQXe';
      const hashedPassword = HashedPassword.create(hashValue);

      expect(hashedPassword.equals(undefined)).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('should accept very long hash values', () => {
      const longHash = 'a'.repeat(200);

      const hashedPassword = HashedPassword.create(longHash);

      expect(hashedPassword).toBeInstanceOf(HashedPassword);
      expect(hashedPassword.value).toBe(longHash);
      expect(hashedPassword.value.length).toBe(200);
    });

    it('should accept hash with special characters', () => {
      const hashValue = '$2b$10$./+ABCabc123XYZ-_=[]{}';

      const hashedPassword = HashedPassword.create(hashValue);

      expect(hashedPassword).toBeInstanceOf(HashedPassword);
      expect(hashedPassword.value).toBe(hashValue);
    });

    it('should not validate hash format - only minimum length', () => {
      // HashedPassword doesn't know about specific hash algorithms
      // It only checks that it's a reasonable length string
      const notReallyAHash = 'this_is_not_a_real_hash_but_long_enough';

      const hashedPassword = HashedPassword.create(notReallyAHash);

      expect(hashedPassword).toBeInstanceOf(HashedPassword);
      expect(hashedPassword.value).toBe(notReallyAHash);
    });
  });
});
