import { ValidationError } from '@/domain/common/errors';
import { Bool } from '../Boolean';

describe('Bool', () => {
  it('should create a valid Bool with true', () => {
    const bool = Bool.create(true);

    expect(bool).toBeInstanceOf(Bool);
    expect(bool.value).toBe(true);
  });

  it('should create a valid Bool with false', () => {
    const bool = Bool.create(false);

    expect(bool).toBeInstanceOf(Bool);
    expect(bool.value).toBe(false);
  });

  it('should throw ValidationError if value is not a boolean', () => {
    // @ts-expect-error testing invalid input
    expect(() => Bool.create('true')).toThrow(ValidationError);
    // @ts-expect-error testing invalid input
    expect(() => Bool.create('true')).toThrow(/boolean/);
  });

  it('should throw ValidationError if value is a number', () => {
    // @ts-expect-error testing invalid input
    expect(() => Bool.create(1)).toThrow(ValidationError);
    // @ts-expect-error testing invalid input
    expect(() => Bool.create(0)).toThrow(ValidationError);
  });

  it('should throw ValidationError if value is null', () => {
    // @ts-expect-error testing invalid input
    expect(() => Bool.create(null)).toThrow(ValidationError);
    // @ts-expect-error testing invalid input
    expect(() => Bool.create(null)).toThrow(/required/);
  });

  it('should throw ValidationError if value is undefined', () => {
    // @ts-expect-error testing invalid input
    expect(() => Bool.create(undefined)).toThrow(ValidationError);
    // @ts-expect-error testing invalid input
    expect(() => Bool.create(undefined)).toThrow(/required/);
  });

  describe('equals', () => {
    it('should consider two Bool with the same value as equal', () => {
      const bool1 = Bool.create(true);
      const bool2 = Bool.create(true);

      expect(bool1.equals(bool2)).toBe(true);
    });

    it('should consider two Bool with different values as not equal', () => {
      const bool1 = Bool.create(true);
      const bool2 = Bool.create(false);

      expect(bool1.equals(bool2)).toBe(false);
    });
  });
});
