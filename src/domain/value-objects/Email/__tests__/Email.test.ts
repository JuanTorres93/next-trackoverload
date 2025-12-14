import { ValidationError } from '@/domain/common/errors';
import { Email } from '../Email';

describe('Email', () => {
  it('should create a valid Email', () => {
    const emailValue = 'user@example.com';

    const email = Email.create(emailValue);

    expect(email).toBeInstanceOf(Email);
    expect(email.value).toBe(emailValue);
  });

  it('should trim whitespace from email value', () => {
    const emailValue = '   user@example.com   ';
    const trimmedValue = 'user@example.com';

    const email = Email.create(emailValue);

    expect(email.value).toBe(trimmedValue);
  });

  it('should throw validation error if email is not a string', () => {
    // @ts-expect-error testing invalid input
    expect(() => Email.create(123)).toThrow(ValidationError);
    // @ts-expect-error testing invalid input
    expect(() => Email.create(123)).toThrow(/string/);
  });

  it('should throw validation error if email is empty', () => {
    expect(() => Email.create('')).toThrow(ValidationError);
    expect(() => Email.create('   ')).toThrow(ValidationError);
  });

  describe('Invalid email formats', () => {
    const errorRegex = /valid email/;

    it('should throw validation error for email without @ symbol', () => {
      const email = 'notanemail';
      expect(() => Email.create(email)).toThrow(ValidationError);
      expect(() => Email.create(email)).toThrow(errorRegex);
    });

    it('should throw validation error for email with missing domain', () => {
      const email = 'user@';
      expect(() => Email.create(email)).toThrow(ValidationError);
      expect(() => Email.create(email)).toThrow(errorRegex);
    });

    it('should throw validation error for email with missing local part', () => {
      const email = '@example.com';
      expect(() => Email.create(email)).toThrow(ValidationError);
      expect(() => Email.create(email)).toThrow(errorRegex);
    });

    it('should throw validation error for email with space in local part', () => {
      const email = 'user @example.com';
      expect(() => Email.create(email)).toThrow(ValidationError);
      expect(() => Email.create(email)).toThrow(errorRegex);
    });

    it('should throw validation error for email with space in domain', () => {
      const email = 'user@ example.com';
      expect(() => Email.create(email)).toThrow(ValidationError);
      expect(() => Email.create(email)).toThrow(errorRegex);
    });

    it('should throw validation error for email without TLD', () => {
      const email = 'user@example';
      expect(() => Email.create(email)).toThrow(ValidationError);
      expect(() => Email.create(email)).toThrow(errorRegex);
    });

    it('should throw validation error for email with consecutive dots', () => {
      const email = 'user@example..com';
      expect(() => Email.create(email)).toThrow(ValidationError);
      expect(() => Email.create(email)).toThrow(errorRegex);
    });

    it('should throw for local part starting with dot', () => {
      const email = '.user@example.com';
      expect(() => Email.create(email)).toThrow(ValidationError);
      expect(() => Email.create(email)).toThrow(errorRegex);
    });

    it('should throw for local part ending with dot', () => {
      const email = 'user.@example.com';
      expect(() => Email.create(email)).toThrow(ValidationError);
      expect(() => Email.create(email)).toThrow(errorRegex);
    });

    it('should throw for consecutive dots in local part', () => {
      const email = 'us..er@example.com';
      expect(() => Email.create(email)).toThrow(ValidationError);
      expect(() => Email.create(email)).toThrow(errorRegex);
    });

    it('should throw for domain starting with dot', () => {
      const email = 'user@.example.com';
      expect(() => Email.create(email)).toThrow(ValidationError);
      expect(() => Email.create(email)).toThrow(errorRegex);
    });

    it('should throw for domain ending with dot', () => {
      const email = 'user@example.com.';
      expect(() => Email.create(email)).toThrow(ValidationError);
      expect(() => Email.create(email)).toThrow(errorRegex);
    });

    it('should throw for domain label starting with hyphen', () => {
      const email = 'user@-example.com';
      expect(() => Email.create(email)).toThrow(ValidationError);
      expect(() => Email.create(email)).toThrow(errorRegex);
    });

    it('should throw for domain label ending with hyphen', () => {
      const email = 'user@example-.com';
      expect(() => Email.create(email)).toThrow(ValidationError);
      expect(() => Email.create(email)).toThrow(errorRegex);
    });

    it('should throw for underscore in domain', () => {
      const email = 'user@exa_mple.com';
      expect(() => Email.create(email)).toThrow(ValidationError);
      expect(() => Email.create(email)).toThrow(errorRegex);
    });

    it('should throw for TLD with 1 char', () => {
      const email = 'user@example.c';
      expect(() => Email.create(email)).toThrow(ValidationError);
      expect(() => Email.create(email)).toThrow(errorRegex);
    });
  });

  it('should accept valid email formats with subdomains', () => {
    const validEmails = [
      'user@example.com',
      'user.name@example.com',
      'user+tag@example.co.uk',
      'test@subdomain.example.com',
      'a@b.co',
    ];

    validEmails.forEach((validEmail) => {
      const email = Email.create(validEmail);
      expect(email.value).toBe(validEmail);
    });
  });

  it('should accept emails with numbers and special characters', () => {
    const emailValue = 'user123+test@example-domain.co.uk';

    const email = Email.create(emailValue);

    expect(email.value).toBe(emailValue);
  });
});
