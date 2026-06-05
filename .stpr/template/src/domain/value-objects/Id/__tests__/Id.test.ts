import { describe, it, expect } from 'vitest';
import { ValidationDomainError } from '../../../common/domainErrors';
import { Id } from '../Id';

describe('Id', () => {
  it('should create a valid Id', async () => {
    const idValue = 'valid-id-123';

    const id = Id.create(idValue);

    expect(id).toBeInstanceOf(Id);
    expect(id.value).toBe(idValue);
  });

  it('should trim whitespace from id value', async () => {
    const idValue = '   valid-id-456   ';

    const id = Id.create(idValue);

    expect(id).toBeInstanceOf(Id);
    expect(id.value).toBe('valid-id-456');
  });

  describe('Errors', () => {
    it('should throw ValidationDomainError if id is empty', async () => {
      const idValue = '';

      expect(() => {
        Id.create(idValue);
      }).toThrow(ValidationDomainError);
      expect(() => {
        Id.create(idValue);
      }).toThrow(/empty/i);
    });

    it('should throw ValidationDomainError if id is only whitespaces', async () => {
      const idValue = '     ';

      expect(() => {
        Id.create(idValue);
      }).toThrow(ValidationDomainError);
      expect(() => {
        Id.create(idValue);
      }).toThrow(/empty/i);
    });

    it('should throw ValidationDomainError if id is null', async () => {
      const idValue = null;

      expect(() => {
        // @ts-expect-error testing invalid type
        Id.create(idValue);
      }).toThrow(ValidationDomainError);

      expect(() => {
        // @ts-expect-error testing invalid type
        Id.create(idValue);
      }).toThrow(/empty/i);
    });

    it('should throw ValidationDomainError if id is undefined', async () => {
      const idValue = undefined;

      expect(() => {
        // @ts-expect-error testing invalid type
        Id.create(idValue);
      }).toThrow(ValidationDomainError);

      expect(() => {
        // @ts-expect-error testing invalid type
        Id.create(idValue);
      }).toThrow(/empty/i);
    });

    it('should throw ValidationDomainError for number id', async () => {
      const idValue = 123;

      expect(() => {
        // @ts-expect-error testing invalid type
        Id.create(idValue);
      }).toThrow(ValidationDomainError);

      expect(() => {
        // @ts-expect-error testing invalid type
        Id.create(idValue);
      }).toThrow(/string/i);
    });

    it('should throw ValidationDomainError for object id', async () => {
      const idValue = { key: 'value' };

      expect(() => {
        // @ts-expect-error testing invalid type
        Id.create(idValue);
      }).toThrow(ValidationDomainError);

      expect(() => {
        // @ts-expect-error testing invalid type
        Id.create(idValue);
      }).toThrow(/string/i);
    });

    it('should throw ValidationDomainError for array id', async () => {
      const idValue = ['array'];

      expect(() => {
        // @ts-expect-error testing invalid type
        Id.create(idValue);
      }).toThrow(ValidationDomainError);

      expect(() => {
        // @ts-expect-error testing invalid type
        Id.create(idValue);
      }).toThrow(/string/i);
    });

    it('should throw ValidationDomainError for boolean id', async () => {
      const idValue = true;

      expect(() => {
        // @ts-expect-error testing invalid type
        Id.create(idValue);
      }).toThrow(ValidationDomainError);

      expect(() => {
        // @ts-expect-error testing invalid type
        Id.create(idValue);
      }).toThrow(/string/i);
    });
  });
});
