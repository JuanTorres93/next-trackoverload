import { ValidationError } from '@/domain/common/errors';
import { DayId } from '../DayId';

describe('DayId', () => {
  it('should create a valid DayId', async () => {
    const id = DayId.create({
      day: 1,
      month: 1,
      year: 2024,
    });

    expect(id).toBeInstanceOf(DayId);
    expect(id.value).toBe('20240101');
  });

  it('should throw ValidationError when day is 0', async () => {
    expect(() => DayId.create({ day: 0, month: 1, year: 2024 })).toThrow(
      ValidationError
    );
  });

  it('should throw ValidationError when day is 32', async () => {
    expect(() => DayId.create({ day: 32, month: 1, year: 2024 })).toThrow(
      ValidationError
    );
  });

  it('should throw ValidationError when month is 0', async () => {
    expect(() => DayId.create({ day: 15, month: 0, year: 2024 })).toThrow(
      ValidationError
    );
  });

  it('should throw ValidationError when month is 13', async () => {
    expect(() => DayId.create({ day: 15, month: 13, year: 2024 })).toThrow(
      ValidationError
    );
  });

  it('should throw ValidationError when year is negative', async () => {
    expect(() => DayId.create({ day: 15, month: 1, year: -1 })).toThrow(
      ValidationError
    );
  });

  it('should throw ValidationError when day is missing', async () => {
    // @ts-expect-error Testing missing property
    expect(() => DayId.create({ month: 1, year: 2024 })).toThrow(
      ValidationError
    );
  });

  it('should throw ValidationError when month is missing', async () => {
    // @ts-expect-error Testing missing property
    expect(() => DayId.create({ day: 15, year: 2024 })).toThrow(
      ValidationError
    );
  });

  it('should throw ValidationError when year is missing', async () => {
    // @ts-expect-error Testing missing property
    expect(() => DayId.create({ day: 15, month: 1 })).toThrow(ValidationError);
  });

  it('should throw ValidationError when day is negative', async () => {
    expect(() => DayId.create({ day: -5, month: 1, year: 2024 })).toThrow(
      ValidationError
    );
  });

  it('should throw ValidationError when month is negative', async () => {
    expect(() => DayId.create({ day: 15, month: -3, year: 2024 })).toThrow(
      ValidationError
    );
  });
});
