import { ValidationError } from '@/domain/common/errors';
import {
  SubscriptionStatus,
  VALID_SUBSCRIPTION_STATUSES,
} from '../SubscriptionStatus';

describe('SubscriptionStatus', () => {
  describe('valid values', () => {
    it.each(VALID_SUBSCRIPTION_STATUSES)(
      'should create SubscriptionStatus with value "%s"',
      (status) => {
        const subscriptionStatus = SubscriptionStatus.create(status);

        expect(subscriptionStatus).toBeInstanceOf(SubscriptionStatus);
        expect(subscriptionStatus.value).toBe(status);
      },
    );
  });

  describe('invalid values', () => {
    it('should throw ValidationError for an unknown status', () => {
      expect(() => SubscriptionStatus.create('premium')).toThrow(
        ValidationError,
      );
    });

    it('should throw ValidationError for an empty string', () => {
      expect(() => SubscriptionStatus.create('')).toThrow(ValidationError);
    });

    it('should throw ValidationError for a non-string value', () => {
      // @ts-expect-error testing invalid input
      expect(() => SubscriptionStatus.create(123)).toThrow(ValidationError);
    });

    it('should include valid values in the error message', () => {
      expect(() => SubscriptionStatus.create('invalid')).toThrow(
        /active.*canceled.*expired.*free_trial.*free/,
      );
    });
  });

  describe('equals', () => {
    it('should be equal to another SubscriptionStatus with the same value', () => {
      const a = SubscriptionStatus.create('active');
      const b = SubscriptionStatus.create('active');
      expect(a.equals(b)).toBe(true);
    });

    it('should not be equal to a SubscriptionStatus with a different value', () => {
      const a = SubscriptionStatus.create('active');
      const b = SubscriptionStatus.create('expired');
      expect(a.equals(b)).toBe(false);
    });
  });
});
