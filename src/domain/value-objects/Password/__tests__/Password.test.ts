import { ValidationError } from '@/domain/common/errors';
import { Password } from '../Password';

describe('Password', () => {
  describe('Valid passwords', () => {
    it('should create a valid Password with default options', () => {
      const passwordValue = 'Password123!';

      const password = Password.create(passwordValue);

      expect(password).toBeInstanceOf(Password);
      expect(password.value).toBe(passwordValue);
    });

    it('should create a valid Password with minimum requirements', () => {
      const passwordValue = 'Pass123!';

      const password = Password.create(passwordValue);

      expect(password).toBeInstanceOf(Password);
      expect(password.value).toBe(passwordValue);
    });

    it('should create a valid Password with special characters', () => {
      const specialChars = [
        '!',
        '@',
        '#',
        '$',
        '%',
        '^',
        '&',
        '*',
        '(',
        ')',
        ',',
        '.',
        '?',
        ':',
        ';',
        '"',
        '{',
        '}',
        '|',
        '<',
        '>',
        '_',
        '-',
        '+',
        '=',
        '[',
        ']',
        '\\',
        '/',
        "'",
        '`',
        '~',
      ];

      const passwords = specialChars.map((char) => `Password123${char}`);

      passwords.forEach((pwd) => {
        const password = Password.create(pwd);
        expect(password).toBeInstanceOf(Password);
        expect(password.value).toBe(pwd);
      });
    });

    it('should create a valid Password with custom options', () => {
      const passwordValue = 'simple123';

      const password = Password.create(passwordValue, {
        minLength: 6,
        requireUppercase: false,
        requireSpecialChar: false,
      });

      expect(password).toBeInstanceOf(Password);
      expect(password.value).toBe(passwordValue);
    });

    it('should create a valid Password with only lowercase requirement', () => {
      const passwordValue = 'simplepassword';

      const password = Password.create(passwordValue, {
        requireUppercase: false,
        requireNumber: false,
        requireSpecialChar: false,
      });

      expect(password).toBeInstanceOf(Password);
      expect(password.value).toBe(passwordValue);
    });

    it('should create a Password with maximum length', () => {
      const passwordValue = 'A'.repeat(125) + 'a1!';

      const password = Password.create(passwordValue);

      expect(password).toBeInstanceOf(Password);
      expect(password.value).toBe(passwordValue);
    });

    it('should trim whitespace from password value', () => {
      const passwordValue = '   Password123!   ';
      const trimmedValue = 'Password123!';

      const password = Password.create(passwordValue);

      expect(password.value).toBe(trimmedValue);
    });
  });

  describe('Invalid passwords - type validation', () => {
    it('should throw validation error if password is not a string', () => {
      // @ts-expect-error testing invalid input
      expect(() => Password.create(123)).toThrow(ValidationError);
      // @ts-expect-error testing invalid input
      expect(() => Password.create(123)).toThrow(/string/);
    });

    it('should throw validation error if password is null', () => {
      // @ts-expect-error testing invalid input
      expect(() => Password.create(null)).toThrow(ValidationError);
      // @ts-expect-error testing invalid input
      expect(() => Password.create(null)).toThrow(/string/);
    });

    it('should throw validation error if password is undefined', () => {
      // @ts-expect-error testing invalid input
      expect(() => Password.create(undefined)).toThrow(ValidationError);
      // @ts-expect-error testing invalid input
      expect(() => Password.create(undefined)).toThrow(/string/);
    });

    it('should throw validation error if password is empty', () => {
      expect(() => Password.create('')).toThrow(ValidationError);
      expect(() => Password.create('')).toThrow(/cannot be empty/);
    });

    it('should throw validation error if password is only whitespace', () => {
      expect(() => Password.create('   ')).toThrow(ValidationError);
      expect(() => Password.create('   ')).toThrow(/cannot be empty/);
    });
  });

  describe('Invalid passwords - length validation', () => {
    it('should throw validation error if password is too short', () => {
      const shortPassword = 'Pass1!';

      expect(() => Password.create(shortPassword)).toThrow(ValidationError);
      expect(() => Password.create(shortPassword)).toThrow(
        /at least 8 characters/,
      );
    });

    it('should throw validation error if password exceeds max length', () => {
      const longPassword = 'A'.repeat(129) + 'a1!';

      expect(() => Password.create(longPassword)).toThrow(ValidationError);
      expect(() => Password.create(longPassword)).toThrow(
        /must not exceed 128 characters/,
      );
    });

    it('should throw validation error if password is too short with custom minLength', () => {
      const shortPassword = 'Pass1';

      expect(() => Password.create(shortPassword, { minLength: 10 })).toThrow(
        ValidationError,
      );
      expect(() => Password.create(shortPassword, { minLength: 10 })).toThrow(
        /at least 10 characters/,
      );
    });

    it('should throw validation error if password exceeds custom maxLength', () => {
      const longPassword = 'Password123!Password123!';

      expect(() => Password.create(longPassword, { maxLength: 16 })).toThrow(
        ValidationError,
      );
      expect(() => Password.create(longPassword, { maxLength: 16 })).toThrow(
        /must not exceed 16 characters/,
      );
    });
  });

  describe('Invalid passwords - uppercase requirement', () => {
    it('should throw validation error if password has no uppercase letter', () => {
      const noUppercase = 'password123!';

      expect(() => Password.create(noUppercase)).toThrow(ValidationError);
      expect(() => Password.create(noUppercase)).toThrow(/uppercase letter/);
    });

    it('should not throw if uppercase is not required', () => {
      const noUppercase = 'password123!';

      const password = Password.create(noUppercase, {
        requireUppercase: false,
      });

      expect(password).toBeInstanceOf(Password);
    });
  });

  describe('Invalid passwords - lowercase requirement', () => {
    it('should throw validation error if password has no lowercase letter', () => {
      const noLowercase = 'PASSWORD123!';

      expect(() => Password.create(noLowercase)).toThrow(ValidationError);
      expect(() => Password.create(noLowercase)).toThrow(/lowercase letter/);
    });

    it('should not throw if lowercase is not required', () => {
      const noLowercase = 'PASSWORD123!';

      const password = Password.create(noLowercase, {
        requireLowercase: false,
      });

      expect(password).toBeInstanceOf(Password);
    });
  });

  describe('Invalid passwords - number requirement', () => {
    it('should throw validation error if password has no number', () => {
      const noNumber = 'Password!';

      expect(() => Password.create(noNumber)).toThrow(ValidationError);
      expect(() => Password.create(noNumber)).toThrow(/number/);
    });

    it('should not throw if number is not required', () => {
      const noNumber = 'Password!';

      const password = Password.create(noNumber, { requireNumber: false });

      expect(password).toBeInstanceOf(Password);
    });
  });

  describe('Invalid passwords - special character requirement', () => {
    it('should throw validation error if password has no special character', () => {
      const noSpecialChar = 'Password123';

      expect(() => Password.create(noSpecialChar)).toThrow(ValidationError);
      expect(() => Password.create(noSpecialChar)).toThrow(/special character/);
    });

    it('should not throw if special character is not required', () => {
      const noSpecialChar = 'Password123';

      const password = Password.create(noSpecialChar, {
        requireSpecialChar: false,
      });

      expect(password).toBeInstanceOf(Password);
    });
  });

  describe('Password equality', () => {
    it('should return true for equal passwords', () => {
      const password1 = Password.create('Password123!');
      const password2 = Password.create('Password123!');

      expect(password1.equals(password2)).toBe(true);
    });

    it('should return false for different passwords', () => {
      const password1 = Password.create('Password123!');
      const password2 = Password.create('Different123!');

      expect(password1.equals(password2)).toBe(false);
    });

    it('should return false when comparing with undefined', () => {
      const password = Password.create('Password123!');

      expect(password.equals(undefined)).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('should accept password with all requirement types', () => {
      const complexPassword = 'C0mpl3x!P@ssw0rd#2024';

      const password = Password.create(complexPassword);

      expect(password).toBeInstanceOf(Password);
      expect(password.value).toBe(complexPassword);
    });

    it('should accept password exactly at minimum length', () => {
      const minPassword = 'Pass123!';

      const password = Password.create(minPassword);

      expect(password).toBeInstanceOf(Password);
      expect(password.value).toBe(minPassword);
    });

    it('should accept password exactly at maximum length', () => {
      const maxPassword = 'A'.repeat(125) + 'a1!';

      const password = Password.create(maxPassword);

      expect(password).toBeInstanceOf(Password);
      expect(password.value).toBe(maxPassword);
      expect(password.value.length).toBe(128);
    });

    it('should allow disabling all complexity requirements', () => {
      const simplePassword = 'simplepass';

      const password = Password.create(simplePassword, {
        requireUppercase: false,
        requireNumber: false,
        requireSpecialChar: false,
        minLength: 6,
      });

      expect(password).toBeInstanceOf(Password);
      expect(password.value).toBe(simplePassword);
    });
  });
});
