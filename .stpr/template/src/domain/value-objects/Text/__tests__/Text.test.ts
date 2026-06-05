import { describe, it, expect } from 'vitest';
import { ValidationDomainError } from '../../../common/domainErrors';
import { Text } from '../Text';

describe('Text', () => {
  it('should create a valid Text', async () => {
    const textValue = 'Example of valid text';

    const text = Text.create(textValue);

    expect(text).toBeInstanceOf(Text);
    expect(text.value).toBe(textValue);
  });

  it('should throw validation error if text is not a string', async () => {
    // @ts-expect-error testing invalid input
    expect(() => Text.create(123)).toThrow(ValidationDomainError);
    // @ts-expect-error testing invalid input
    expect(() => Text.create(123)).toThrow(/string/);
  });

  it('should trim whitespace from the text value', async () => {
    const textValue = '   Text with whitespace   ';
    const trimmedValue = 'Text with whitespace';

    const text = Text.create(textValue);

    expect(text.value).toBe(trimmedValue);
  });

  it('should respect maxLength value', async () => {
    const longText = 'a'.repeat(1001);
    const maxLength = 20;
    const options = { maxLength };

    expect(() => Text.create(longText, options)).toThrow(ValidationDomainError);
    expect(() => Text.create(longText, options)).toThrow(/length.*exceed/);
  });

  describe('Equality checks', () => {
    it('should consider two Text instances with the same value as equal', async () => {
      const textValue = 'Same text';
      const text1 = Text.create(textValue);
      const text2 = Text.create(textValue);

      expect(text1.equals(text2)).toBe(true);
    });

    it('should consider two Text instances with different values as not equal', async () => {
      const text1 = Text.create('Text one');
      const text2 = Text.create('Text two');

      expect(text1.equals(text2)).toBe(false);
    });

    it('should consider capitalization as different', async () => {
      const text1 = Text.create('Text');
      const text2 = Text.create('text');

      expect(text1.equals(text2)).toBe(false);
    });
  });

  describe('Errors', () => {
    it('should throw error if not empty text is allowed', async () => {
      const emptyText = '';
      const options = { canBeEmpty: false };

      expect(() => Text.create(emptyText, options)).toThrow(
        ValidationDomainError,
      );
      expect(() => Text.create(emptyText, options)).toThrow(/cannot be empty/);
    });
  });
});
