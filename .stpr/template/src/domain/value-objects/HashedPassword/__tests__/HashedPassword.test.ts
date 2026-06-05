import { describe, it, expect } from 'vitest';
import { ValidationDomainError } from '../../../common/domainErrors';
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

    it('should trim whitespace from hashed password value', () => {
      const hashValue =
        '   $2b$10$rI7Qo3.7fZFQZQYQXYQXeOzQ7fZFQZQYQXYQXeOzQ7fZFQZQYQXYQXe   ';
      const trimmedValue =
        '$2b$10$rI7Qo3.7fZFQZQYQXYQXeOzQ7fZFQZQYQXYQXeOzQ7fZFQZQYQXYQXe';

      const hashedPassword = HashedPassword.create(hashValue);

      expect(hashedPassword.value).toBe(trimmedValue);
    });
  });

  describe('Errors', () => {
    it('should throw validation error if value is not a string', () => {
      // @ts-expect-error testing invalid input
      expect(() => HashedPassword.create(123)).toThrow(ValidationDomainError);
      // @ts-expect-error testing invalid input
      expect(() => HashedPassword.create(123)).toThrow(/string/);
    });

    it('should throw validation error if value is null', () => {
      // @ts-expect-error testing invalid input
      expect(() => HashedPassword.create(null)).toThrow(ValidationDomainError);
      // @ts-expect-error testing invalid input
      expect(() => HashedPassword.create(null)).toThrow(/string/);
    });

    it('should throw validation error if value is undefined', () => {
      // @ts-expect-error testing invalid input
      expect(() => HashedPassword.create(undefined)).toThrow(
        ValidationDomainError,
      );
      // @ts-expect-error testing invalid input
      expect(() => HashedPassword.create(undefined)).toThrow(/string/);
    });

    it('should throw validation error if value is empty', () => {
      expect(() => HashedPassword.create('')).toThrow(ValidationDomainError);
      expect(() => HashedPassword.create('')).toThrow(/cannot be empty/);
    });

    it('should throw validation error if value is only whitespace', () => {
      expect(() => HashedPassword.create('   ')).toThrow(ValidationDomainError);
      expect(() => HashedPassword.create('   ')).toThrow(/cannot be empty/);
    });

    it('should throw validation error if value is too short', () => {
      const shortHash = 'abc123';

      expect(() => HashedPassword.create(shortHash)).toThrow(
        ValidationDomainError,
      );
      expect(() => HashedPassword.create(shortHash)).toThrow(
        /not a valid hash/i,
      );
    });

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
  });
});
