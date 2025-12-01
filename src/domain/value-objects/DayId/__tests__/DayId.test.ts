import { ValidationError } from '@/domain/common/errors';
import { DayId, stringDayIdToDate } from '../DayId';

describe('DayId', () => {
  it('should create a valid DayId', async () => {
    const idValue = new Date('2024-01-01');

    const id = DayId.create(idValue);

    expect(id).toBeInstanceOf(DayId);
    expect(id.value).toBe('20240101');
  });

  it('should throw ValidationError if id is string', async () => {
    const idValue = 'string-id';

    expect(() => {
      // @ts-expect-error testing invalid type
      DayId.create(idValue);
    }).toThrowError(ValidationError);

    expect(() => {
      // @ts-expect-error testing invalid type
      DayId.create(idValue);
    }).toThrowError(/date instance/i);
  });

  it('should throw ValidationError if id is null', async () => {
    const idValue = null;

    expect(() => {
      // @ts-expect-error testing invalid type
      DayId.create(idValue);
    }).toThrowError(ValidationError);

    expect(() => {
      // @ts-expect-error testing invalid type
      DayId.create(idValue);
    }).toThrowError(/empty/i);
  });

  it('should throw ValidationError if id is undefined', async () => {
    const idValue = undefined;

    expect(() => {
      // @ts-expect-error testing invalid type
      DayId.create(idValue);
    }).toThrowError(ValidationError);

    expect(() => {
      // @ts-expect-error testing invalid type
      DayId.create(idValue);
    }).toThrowError(/empty/i);
  });

  it('should throw ValidationError for number id', async () => {
    const idValue = 123;

    expect(() => {
      // @ts-expect-error testing invalid type
      DayId.create(idValue);
    }).toThrowError(ValidationError);

    expect(() => {
      // @ts-expect-error testing invalid type
      DayId.create(idValue);
    }).toThrowError(/date instance/i);
  });

  it('should throw ValidationError for object id', async () => {
    const idValue = { key: 'value' };

    expect(() => {
      // @ts-expect-error testing invalid type
      DayId.create(idValue);
    }).toThrowError(ValidationError);

    expect(() => {
      // @ts-expect-error testing invalid type
      DayId.create(idValue);
    }).toThrowError(/date instance/i);
  });

  it('should throw ValidationError for array id', async () => {
    const idValue = ['array'];

    expect(() => {
      // @ts-expect-error testing invalid type
      DayId.create(idValue);
    }).toThrowError(ValidationError);

    expect(() => {
      // @ts-expect-error testing invalid type
      DayId.create(idValue);
    }).toThrowError(/date instance/i);
  });

  it('should throw ValidationError for boolean id', async () => {
    const idValue = true;

    expect(() => {
      // @ts-expect-error testing invalid type
      DayId.create(idValue);
    }).toThrowError(ValidationError);

    expect(() => {
      // @ts-expect-error testing invalid type
      DayId.create(idValue);
    }).toThrowError(/date instance/i);
  });

  describe('helper function', () => {
    it('should correctly parse DayId string to Date', async () => {
      const dayIdString = '20240615';

      const date = stringDayIdToDate(dayIdString);

      expect(date).toBeInstanceOf(Date);
      expect(date.getUTCFullYear()).toBe(2024);
      // Month is June (6th)
      expect(date.getUTCMonth()).toBe(5); // Months are zero-indexed
      expect(date.getUTCDate()).toBe(15);
    });

    it('should throw ValidationError for invalid DayId string', async () => {
      const invalidDayIdString = '2024-06-15';

      expect(() => {
        stringDayIdToDate(invalidDayIdString);
      }).toThrowError(ValidationError);

      expect(() => {
        stringDayIdToDate(invalidDayIdString);
      }).toThrowError(/yyyyMMdd format/i);
    });
  });
});
