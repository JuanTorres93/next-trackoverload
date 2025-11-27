import { beforeEach, describe, expect, it } from 'vitest';

import { User, UserProps } from '../User';
import { ValidationError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';
import { Id } from '@/domain/types/Id/Id';

describe('User', () => {
  let user: User;
  let validUserProps: UserProps;

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

  it('should throw ValidationError for empty name', () => {
    expect(() => User.create({ ...validUserProps, name: '' })).toThrowError(
      ValidationError
    );
  });

  it('should set createdAt and updatedAt if not provided', () => {
    const userWithoutDates = User.create({
      id: Id.create('2'),
      name: 'Another User',
      customerId: 'customer-2',
      createdAt: undefined as unknown as Date,
      updatedAt: undefined as unknown as Date,
    });
    expect(userWithoutDates.createdAt).toBeInstanceOf(Date);
    expect(userWithoutDates.updatedAt).toBeInstanceOf(Date);
  });

  it('should throw error if customerId is invalid', async () => {
    const invalidCustomerIds = ['', '   ', 123, true, {}, [], null];

    for (const invalidCustomerId of invalidCustomerIds) {
      expect(() =>
        // @ts-expect-error Testing invalid inputs
        User.create({ ...validUserProps, customerId: invalidCustomerId })
      ).toThrowError(ValidationError);
    }
  });

  it('should throw error if id is not instance of Id', async () => {
    expect(() =>
      User.create({
        ...validUserProps,
        // @ts-expect-error Testing invalid inputs
        id: 'not-Id',
      })
    ).toThrowError(ValidationError);

    expect(() =>
      User.create({
        ...validUserProps,
        // @ts-expect-error Testing invalid inputs
        id: 'not-Id',
      })
    ).toThrowError(/Id/);
  });
});
