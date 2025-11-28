import { ValidationError } from '@/domain/common/errors';
import { Float } from '../Float';

describe('Float', () => {
  it('should create a valid positive Float by default', async () => {
    const floatValue = 123;

    const float = Float.create(floatValue);
    expect(float).toBeInstanceOf(Float);
    expect(float.value).toBe(floatValue);
  });

  it('should create a valid negative Float by default', async () => {
    const floatValue = -123;

    const float = Float.create(floatValue);
    expect(float).toBeInstanceOf(Float);
    expect(float.value).toBe(floatValue);
  });

  it('should create a valid zero Float by default', async () => {
    const floatValue = 0;
    const float = Float.create(floatValue);
    expect(float).toBeInstanceOf(Float);
    expect(float.value).toBe(floatValue);
  });

  it('should throw validation error if float is not a number', async () => {
    // @ts-expect-error testing invalid input
    expect(() => Float.create('123')).toThrow(ValidationError);
    // @ts-expect-error testing invalid input
    expect(() => Float.create('123')).toThrow(/Float.*number/);
  });

  it('it should throw error if trying to create a negative Float when not allowed', async () => {
    const options = { onlyPositive: true };

    expect(() => {
      Float.create(-10, options);
    }).toThrow(ValidationError);
    expect(() => {
      Float.create(-10, options);
    }).toThrow(/Float.*positive/);
  });

  it('should allow zero when onlyPositive is true', async () => {
    const options = { onlyPositive: true };

    const float = Float.create(0, options);
    expect(float).toBeInstanceOf(Float);
    expect(float.value).toBe(0);
  });

  it('should allow creating positive Float when onlyPositive is true', async () => {
    const options = { onlyPositive: true };
    const floatValue = 50;

    const float = Float.create(floatValue, options);
    expect(float).toBeInstanceOf(Float);
    expect(float.value).toBe(floatValue);
  });

  it('should allow creating negative Float when onlyPositive is false', async () => {
    const options = { onlyPositive: false };
    const floatValue = -50;

    const float = Float.create(floatValue, options);
    expect(float).toBeInstanceOf(Float);
    expect(float.value).toBe(floatValue);
  });

  it('should allow creating zero Float when onlyPositive is false', async () => {
    const options = { onlyPositive: false };
    const floatValue = 0;

    const float = Float.create(floatValue, options);
    expect(float).toBeInstanceOf(Float);
    expect(float.value).toBe(floatValue);
  });

  it('should throw error if trying to create zero when it is not allowed', async () => {
    const options = { canBeZero: false };

    expect(() => {
      Float.create(0, options);
    }).toThrow(ValidationError);
    expect(() => {
      Float.create(0, options);
    }).toThrow(/Float.*zero/);
  });
});
