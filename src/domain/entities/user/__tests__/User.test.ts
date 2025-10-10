import { beforeEach, describe, expect, it } from 'vitest';

import { User, UserProps } from '../User';
import { ValidationError } from '@/domain/common/errors';

describe('User', () => {
  let user: User;
  let validUserProps: UserProps;

  beforeEach(() => {
    validUserProps = {
      id: '1',
      name: 'Test User',
      customerId: 'customer-1',
      createdAt: new Date(),
      updatedAt: new Date(),
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

  it('should throw ValidationError for empty id', () => {
    expect(() => User.create({ ...validUserProps, id: '' })).toThrowError(
      ValidationError
    );
  });

  it('should throw ValidationError for empty name', () => {
    expect(() => User.create({ ...validUserProps, name: '' })).toThrowError(
      ValidationError
    );
  });

  it('should set createdAt and updatedAt if not provided', () => {
    const userWithoutDates = User.create({
      id: '2',
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
});
