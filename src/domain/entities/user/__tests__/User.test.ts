import { beforeEach, describe, expect, it } from 'vitest';

import * as vp from '@/../tests/createProps';
import { ValidationError } from '@/domain/common/errors';
import { Id } from '@/domain/value-objects/Id/Id';
import { User, UserCreateProps } from '../User';

describe('User', () => {
  let user: User;
  let validUserProps: UserCreateProps;

  beforeEach(() => {
    validUserProps = {
      ...vp.validUserProps,
    };
    user = User.create(validUserProps);
  });

  it('should create a valid user', () => {
    expect(user).toBeInstanceOf(User);
  });

  it('should change its name', async () => {
    const patch = { name: 'Updated User' };
    user.update(patch);
    expect(user.name).toBe('Updated User');
  });

  it('should change its customerId', async () => {
    const newCustomerId = Id.create('new-customer-id');
    const patch = { customerId: newCustomerId };

    user.update(patch);
    expect(user.customerId).toBe(newCustomerId.value);
  });

  it('should throw error is updating customer id with an id that is not an instance of Id', async () => {
    expect(() =>
      // @ts-expect-error Testing invalid inputs
      user.update({ customerId: 'not-Id' })
    ).toThrowError(ValidationError);

    expect(() =>
      // @ts-expect-error Testing invalid inputs
      user.update({ customerId: 'not-Id' })
    ).toThrowError(/customerId.*\sId/);
  });

  it('should throw ValidationError for empty name', () => {
    expect(() => User.create({ ...validUserProps, name: '' })).toThrowError(
      ValidationError
    );
  });

  it('should set createdAt and updatedAt if not provided', () => {
    const userWithoutDates = User.create({
      id: 'another-user-id',
      name: 'Another User',
      customerId: 'another-customer-id',
      createdAt: undefined as unknown as Date,
      updatedAt: undefined as unknown as Date,
    });
    expect(userWithoutDates.createdAt).toBeInstanceOf(Date);
    expect(userWithoutDates.updatedAt).toBeInstanceOf(Date);
  });

  it('should throw error if id is not instance of Id', async () => {
    expect(() =>
      User.create({
        ...validUserProps,
        // @ts-expect-error Testing invalid inputs
        id: 123,
      })
    ).toThrowError(ValidationError);

    expect(() =>
      User.create({
        ...validUserProps,
        // @ts-expect-error Testing invalid inputs
        id: 123,
      })
    ).toThrowError(/Id.*string/);
  });

  it('should throw error if customerId exists and is not instance of Id', async () => {
    expect(() =>
      User.create({
        ...validUserProps,
        // @ts-expect-error Testing invalid inputs
        customerId: 123,
      })
    ).toThrowError(ValidationError);

    expect(() =>
      User.create({
        ...validUserProps,
        // @ts-expect-error Testing invalid inputs
        customerId: 123,
      })
    ).toThrowError(/Id.*string/);
  });
});
