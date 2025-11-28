import { ValidationError } from '@/domain/common/errors';
import { Text } from '../Text';
import { Integer } from '../../Integer/Integer';

describe('Text', () => {
  it('should create a valid Text', async () => {
    const textValue = 'Example of valid text';

    const text = Text.create(textValue);

    expect(text).toBeInstanceOf(Text);
    expect(text.value).toBe(textValue);
  });

  it('should throw validation error if text is not a string', async () => {
    // @ts-expect-error testing invalid input
    expect(() => Text.create(123)).toThrow(ValidationError);
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
    const maxLength = Integer.create(20);
    const options = { maxLength };

    expect(() => Text.create(longText, options)).toThrow(ValidationError);
    expect(() => Text.create(longText, options)).toThrow(/length.*exceed/);
  });

  it('should throw error if not empty text is allowed', async () => {
    const emptyText = '';
    const options = { canBeEmpty: false };

    expect(() => Text.create(emptyText, options)).toThrow(ValidationError);
    expect(() => Text.create(emptyText, options)).toThrow(/cannot be empty/);
  });
});
