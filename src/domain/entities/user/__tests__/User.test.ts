import { beforeEach, describe, expect, it } from 'vitest';

import { ValidationError } from '@/domain/common/errors';
import * as userTestProps from '../../../../../tests/createProps/userTestProps';
import { User, UserCreateProps } from '../User';
import { FREE_TRIAL_DAYS } from '@/domain/common/constants';

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

    it('should have a hashed password', () => {
      expect(user.hashedPassword).not.toBeUndefined();
      expect(user.hashedPassword.length).toBeGreaterThan(10);
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

    it('should update subscription status', async () => {
      const newSubscriptionStatus = 'active';

      expect(user.subscriptionStatus).not.toBe(newSubscriptionStatus);

      const patch = { subscriptionStatus: newSubscriptionStatus };

      user.update(patch);

      expect(user.subscriptionStatus).toBe(newSubscriptionStatus);
    });

    it('should set createdAt and updatedAt if not provided', () => {
      // eslint-disable-next-line
      const { createdAt, updatedAt, ...propsWithoutDates } = validUserProps;

      const userWithoutDates = User.create(propsWithoutDates);

      expect(userWithoutDates).toBeInstanceOf(User);

      const now = new Date();

      expect(userWithoutDates.createdAt.getTime()).toBeLessThanOrEqual(
        now.getTime(),
      );
      expect(userWithoutDates.updatedAt.getTime()).toBeLessThanOrEqual(
        now.getTime(),
      );
    });

    it('may have subscriptionStatus property', async () => {
      const subscriptionStatus = 'active';
      const userWithSubscriptionStatus = User.create({
        ...validUserProps,
        subscriptionStatus,
      });

      expect(userWithSubscriptionStatus).toBeInstanceOf(User);
      expect(userWithSubscriptionStatus.subscriptionStatus).toBe(
        subscriptionStatus,
      );
    });

    it('may have subscriptionEndsAt property', async () => {
      const subscriptionEndsAt = new Date();
      const userWithSubscriptionEndsAt = User.create({
        ...validUserProps,
        subscriptionEndsAt,
      });

      expect(userWithSubscriptionEndsAt).toBeInstanceOf(User);
      expect(userWithSubscriptionEndsAt.subscriptionEndsAt).toBe(
        subscriptionEndsAt,
      );
    });

    it('should update subscriptionEndsAt', async () => {
      const newSubscriptionEndsAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      ); // 7 days from now

      expect(user.subscriptionEndsAt).not.toBe(newSubscriptionEndsAt);

      const patch = { subscriptionEndsAt: newSubscriptionEndsAt };

      user.update(patch);

      expect(user.subscriptionEndsAt).toBe(newSubscriptionEndsAt);
    });

    describe('valid subscription', () => {
      it('should know active subscription is valid', async () => {
        const userWithActiveSubscription = User.create({
          ...validUserProps,
          subscriptionStatus: 'active',
        });

        expect(userWithActiveSubscription.hasValidSubscription).toBe(true);
      });

      it('should know free subscription is valid', async () => {
        const userWithFreeSubscription = User.create({
          ...validUserProps,
          subscriptionStatus: 'free',
        });

        expect(userWithFreeSubscription.hasValidSubscription).toBe(true);
      });

      it('should know free trial subscription is valid if trial not expired', async () => {
        const createdAt = new Date();
        createdAt.setDate(createdAt.getDate() - (FREE_TRIAL_DAYS - 1)); // One day before trial expires

        const userWithFreeTrialSubscription = User.create({
          ...validUserProps,
          subscriptionStatus: 'free_trial',
          createdAt,
        });

        expect(userWithFreeTrialSubscription.hasValidSubscription).toBe(true);
      });

      it('should know free trial subscription is invalid if trial expired', async () => {
        const createdAt = new Date();
        createdAt.setDate(createdAt.getDate() - (FREE_TRIAL_DAYS + 1)); // One day after trial expires

        const userWithExpiredFreeTrialSubscription = User.create({
          ...validUserProps,
          subscriptionStatus: 'free_trial',
          createdAt,
        });

        expect(userWithExpiredFreeTrialSubscription.hasValidSubscription).toBe(
          false,
        );
      });

      it('should know canceled subscription is valid if current date is before subscriptionEndsAt', async () => {
        const subscriptionEndsAt = new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000,
        ); // 7 days from now

        const userWithCanceledSubscription = User.create({
          ...validUserProps,
          subscriptionStatus: 'canceled',
          subscriptionEndsAt,
        });

        expect(userWithCanceledSubscription.hasValidSubscription).toBe(true);
      });

      it('should know canceled subscription is invalid if current date is after subscriptionEndsAt', async () => {
        const subscriptionEndsAt = new Date(
          Date.now() - 7 * 24 * 60 * 60 * 1000,
        ); // 7 days ago

        const userWithExpiredCanceledSubscription = User.create({
          ...validUserProps,
          subscriptionStatus: 'canceled',
          subscriptionEndsAt,
        });

        expect(userWithExpiredCanceledSubscription.hasValidSubscription).toBe(
          false,
        );
      });
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
