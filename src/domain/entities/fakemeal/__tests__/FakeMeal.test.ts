import { beforeEach, describe, expect, it } from 'vitest';

import * as vp from '@/../tests/createProps';
import { ValidationError } from '@/domain/common/errors';
import { FakeMeal, FakeMealCreateProps } from '../FakeMeal';

describe('FakeMeal', () => {
  let fakeMeal: FakeMeal;
  let validFakeMealProps: FakeMealCreateProps;

  beforeEach(() => {
    validFakeMealProps = {
      ...vp.validFakeMealProps,
      name: 'Bocadillo de chusmarro en La Peña',
    };
    fakeMeal = FakeMeal.create(validFakeMealProps);
  });

  it('should create a valid entity', () => {
    expect(fakeMeal).toBeInstanceOf(FakeMeal);
    expect(fakeMeal.userId).toBe(vp.userId);
  });

  it('should update protein', async () => {
    const patch = { protein: 100 };
    fakeMeal.update(patch);
    expect(fakeMeal.protein).toBe(100);
  });

  it('should update calories', async () => {
    const patch = { calories: 1000 };
    fakeMeal.update(patch);
    expect(fakeMeal.calories).toBe(1000);
  });

  it('should update name', async () => {
    const patch = { name: 'New Name' };
    fakeMeal.update(patch);
    expect(fakeMeal.name).toBe('New Name');
  });

  it('should throw validation error for empty name', async () => {
    expect(() =>
      FakeMeal.create({
        ...validFakeMealProps,
        name: '',
      })
    ).toThrow(ValidationError);
  });

  it('should throw validation error for no calories', async () => {
    const props = { ...validFakeMealProps, calories: 0 };
    expect(() =>
      FakeMeal.create({
        ...props,
      })
    ).toThrow(ValidationError);

    expect(() =>
      FakeMeal.create({
        ...props,
        calories: -10,
      })
    ).toThrow(ValidationError);

    expect(() =>
      FakeMeal.create({
        ...props,
        calories: 0,
      })
    ).toThrow(ValidationError);
  });

  it('should throw validation error for no proteins', async () => {
    const props = { ...validFakeMealProps, protein: 0 };
    expect(() =>
      FakeMeal.create({
        ...props,
      })
    ).toThrow(ValidationError);

    expect(() =>
      FakeMeal.create({
        ...props,
        protein: -10,
      })
    ).toThrow(ValidationError);

    expect(() =>
      FakeMeal.create({
        ...props,
        protein: 0,
      })
    ).toThrow(ValidationError);
  });

  it('should throw ValidationError if id is not Instance of Id', async () => {
    expect(() =>
      FakeMeal.create({
        ...validFakeMealProps,
        // @ts-expect-error testing invalid type
        id: 123,
      })
    ).toThrowError(ValidationError);

    expect(() =>
      FakeMeal.create({
        ...validFakeMealProps,
        // @ts-expect-error testing invalid type
        id: 123,
      })
    ).toThrowError(/Id.*string/);
  });

  it('should throw ValidationError if userId is not instance of Id', async () => {
    expect(() =>
      FakeMeal.create({
        ...validFakeMealProps,
        // @ts-expect-error testing invalid type
        userId: 123,
      })
    ).toThrowError(ValidationError);

    expect(() =>
      FakeMeal.create({
        ...validFakeMealProps,
        // @ts-expect-error testing invalid type
        userId: 123,
      })
    ).toThrowError(/Id.*string/);
  });
});
