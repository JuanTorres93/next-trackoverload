import { beforeEach, describe, expect, it } from 'vitest';

import * as vp from '@/../tests/createProps';
import * as userTestProps from '../../../../../tests/createProps/userTestProps';
import { ValidationError } from '@/domain/common/errors';
import { User, UserCreateProps } from '../User';

describe('User', () => {
  let user: User;
  let validUserProps: UserCreateProps;

  beforeEach(() => {
    validUserProps = {
      ...userTestProps.validUserProps,
    };
    user = User.create(validUserProps);
  });

  describe('Behavior', () => {
    it('should create a valid user', () => {
      expect(user).toBeInstanceOf(User);
    });

    it('should have an email', async () => {
      expect(user.email).not.toBeUndefined();
      expect(user.email).toBe(validUserProps.email);
    });

    it('should change its name', async () => {
      const patch = { name: 'Updated User' };
      user.update(patch);
      expect(user.name).toBe('Updated User');
    });

    it('should change its customerId', async () => {
      const newCustomerId = 'new-customer-id';
      const patch = { customerId: newCustomerId };

      user.update(patch);
      expect(user.customerId).toBe(newCustomerId);
    });

    it('should set createdAt and updatedAt if not provided', () => {
      const userWithoutDates = User.create({
        id: 'another-user-id',
        name: 'Another User',
        email: 'anotheruser@example.com',
        customerId: 'another-customer-id',
        createdAt: undefined as unknown as Date,
        updatedAt: undefined as unknown as Date,
      });
      expect(userWithoutDates.createdAt).toBeInstanceOf(Date);
      expect(userWithoutDates.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('Errors', () => {
    it('should throw error if customerId exists and is not instance of Id', async () => {
      expect(() =>
        User.create({
          ...validUserProps,
          // @ts-expect-error Testing invalid inputs
          customerId: 123,
        }),
      ).toThrowError(ValidationError);

      expect(() =>
        User.create({
          ...validUserProps,
          // @ts-expect-error Testing invalid inputs
          customerId: 123,
        }),
      ).toThrowError(/Id.*string/);
    });

    it('should throw error if name is larger than 100 characters', async () => {
      const longName = 'a'.repeat(101);
      expect(() =>
        User.create({
          ...validUserProps,
          name: longName,
        }),
      ).toThrowError(ValidationError);

      expect(() =>
        User.create({
          ...validUserProps,
          name: longName,
        }),
      ).toThrowError(/Text.*not exceed/);
    });

    it('should throw error if patch is not provided when updating', async () => {
      expect(() =>
        // @ts-expect-error Testing invalid inputs
        user.update(),
      ).toThrowError(ValidationError);

      expect(() =>
        // @ts-expect-error Testing invalid inputs
        user.update(),
      ).toThrowError(/User.*patch.*required/);
    });
  });
});
