import { describe, it, expect, beforeEach } from 'vitest';
import { userTestCreateProps } from '../../../../../tests/createEntitiesTest/userCreate';
import { User, UserCreateProps } from '../User';

describe('User', () => {
  let user: User;
  let validUserProps: UserCreateProps;

  beforeEach(() => {
    validUserProps = {
      ...userTestCreateProps,
    };
    user = User.create(validUserProps);
  });

  it('should create a valid user', () => {
    expect(user).toBeInstanceOf(User);
  });

  describe('Creation', () => {
    it('should create user with current date if createdAt is not provided', async () => {
      const propsWithoutCreatedAt = {
        ...validUserProps,
        createdAt: undefined,
      };

      const userWithoutCreatedAt = User.create(propsWithoutCreatedAt);

      expect(userWithoutCreatedAt).toBeInstanceOf(User);
      expect(userWithoutCreatedAt.createdAt).toBeInstanceOf(Date);
      expect(userWithoutCreatedAt.createdAt.getTime()).toBeLessThanOrEqual(
        Date.now(),
      );
    });

    it('should create user with current date if updatedAt is not provided', async () => {
      const propsWithoutUpdatedAt = {
        ...validUserProps,
        updatedAt: undefined,
      };

      const userWithoutUpdatedAt = User.create(propsWithoutUpdatedAt);

      expect(userWithoutUpdatedAt).toBeInstanceOf(User);
      expect(userWithoutUpdatedAt.updatedAt).toBeInstanceOf(Date);
      expect(userWithoutUpdatedAt.updatedAt.getTime()).toBeLessThanOrEqual(
        Date.now(),
      );
    });
  });

  describe('Behaviour', () => {
    it('should convert to create props', async () => {
      const createProps = user.toCreateProps();

      expect(createProps).toEqual(validUserProps);
    });
  });

  describe('Getters', () => {
    it('should return the correct id', () => {
      expect(user.id).toBe(validUserProps.id);
    });

    it('should return the correct email', () => {
      expect(user.email).toBe(validUserProps.email);
    });

    it('should return the correct createdAt', () => {
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('should return the correct updatedAt', () => {
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should return the correct hashedPassword', () => {
      expect(user.hashedPassword).toBe(validUserProps.hashedPassword);
    });
  });
});
