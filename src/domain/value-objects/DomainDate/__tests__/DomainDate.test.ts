import { ValidationError } from '@/domain/common/errors';
import { DomainDate } from '../DomainDate';

describe('DomainDate', () => {
  it('should create a DomainDate with current date when no value is provided', () => {
    const beforeCreation = new Date();
    const domainDate = DomainDate.create();
    const afterCreation = new Date();

    expect(domainDate).toBeInstanceOf(DomainDate);
    expect(domainDate.value).toBeInstanceOf(Date);
    expect(domainDate.value.getTime()).toBeGreaterThanOrEqual(
      beforeCreation.getTime(),
    );
    expect(domainDate.value.getTime()).toBeLessThanOrEqual(
      afterCreation.getTime(),
    );
  });

  it('should create a DomainDate with provided valid date', () => {
    const testDate = new Date('2024-01-15T10:30:00Z');

    const domainDate = DomainDate.create(testDate);

    expect(domainDate).toBeInstanceOf(DomainDate);
    expect(domainDate.value).toBe(testDate);
    expect(domainDate.value.getTime()).toBe(testDate.getTime());
  });

  it('should create a DomainDate with provided valid date. short format', () => {
    const testDate = new Date('2024-01-15');

    const domainDate = DomainDate.create(testDate);

    expect(domainDate).toBeInstanceOf(DomainDate);
    expect(domainDate.value).toBe(testDate);
    expect(domainDate.value.getTime()).toBe(testDate.getTime());
  });

  it('should throw validation error if date is invalid', () => {
    const invalidDate = new Date('invalid date string');

    expect(() => DomainDate.create(invalidDate)).toThrow(ValidationError);
    expect(() => DomainDate.create(invalidDate)).toThrow(
      /date must be a valid date/,
    );
  });

  it('should throw validation error if value is not a Date instance', () => {
    // @ts-expect-error testing invalid input
    expect(() => DomainDate.create('2024-01-15')).toThrow(ValidationError);
    // @ts-expect-error testing invalid input
    expect(() => DomainDate.create('2024-01-15')).toThrow(
      /date must be a valid date/,
    );
  });

  it('should throw validation error if value is a number', () => {
    // @ts-expect-error testing invalid input
    expect(() => DomainDate.create(1234567890)).toThrow(ValidationError);
    // @ts-expect-error testing invalid input
    expect(() => DomainDate.create(1234567890)).toThrow(
      /date must be a valid date/,
    );
  });

  it('should include context in error message when provided', () => {
    const invalidDate = new Date('invalid');

    expect(() => DomainDate.create(invalidDate)).toThrow(ValidationError);
    expect(() => DomainDate.create(invalidDate)).toThrow(
      /DomainDate: date must be a valid date/,
    );
  });

  it('should handle future dates', () => {
    const futureDate = new Date('2030-12-31T23:59:59Z');

    const domainDate = DomainDate.create(futureDate);

    expect(domainDate).toBeInstanceOf(DomainDate);
    expect(domainDate.value).toBe(futureDate);
  });

  it('should handle past dates', () => {
    const pastDate = new Date('1990-01-01T00:00:00Z');

    const domainDate = DomainDate.create(pastDate);

    expect(domainDate).toBeInstanceOf(DomainDate);
    expect(domainDate.value).toBe(pastDate);
  });

  it('should allow comparing two DomainDate instances with equals method', () => {
    const testDate = new Date('2024-01-15T10:30:00Z');
    const date1 = DomainDate.create(testDate);
    const date2 = DomainDate.create(testDate);

    expect(date1.equals(date2)).toBe(true);
  });

  it('should return false when comparing with undefined', () => {
    const testDate = new Date('2024-01-15T10:30:00Z');
    const date1 = DomainDate.create(testDate);

    expect(date1.equals(undefined)).toBe(false);
  });

  it('should return false when comparing different dates', () => {
    const date1 = DomainDate.create(new Date('2024-01-15T10:30:00Z'));
    const date2 = DomainDate.create(new Date('2024-01-16T10:30:00Z'));

    expect(date1.equals(date2)).toBe(false);
  });
});
