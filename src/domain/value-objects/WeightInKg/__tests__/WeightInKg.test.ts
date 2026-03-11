import { ValidationError } from '@/domain/common/errors';
import { WeightInKg } from '../WeightInKg';

describe('WeightInKg', () => {
  it('should create a valid positive WeightInKg', async () => {
    const weight = WeightInKg.create(72.5);

    expect(weight).toBeInstanceOf(WeightInKg);
    expect(weight.value).toBe(72.5);
  });

  it('should create a valid zero WeightInKg', async () => {
    const weight = WeightInKg.create(0);

    expect(weight).toBeInstanceOf(WeightInKg);
    expect(weight.value).toBe(0);
  });

  it('should throw validation error if weight is not a number', async () => {
    // @ts-expect-error testing invalid input
    expect(() => WeightInKg.create('72.5')).toThrow(ValidationError);
    // @ts-expect-error testing invalid input
    expect(() => WeightInKg.create('72.5')).toThrow(/Float.*number/);
  });

  it('should throw validation error if weight is missing', async () => {
    // @ts-expect-error testing invalid input
    expect(() => WeightInKg.create()).toThrow(ValidationError);
    // @ts-expect-error testing invalid input
    expect(() => WeightInKg.create()).toThrow(/Float.*required/);
  });

  it('should throw validation error if weight is negative', async () => {
    expect(() => WeightInKg.create(-1)).toThrow(ValidationError);
    expect(() => WeightInKg.create(-1)).toThrow(/Float.*positive/);
  });
});