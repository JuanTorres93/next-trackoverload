import { ValidationError } from '@/domain/common/errors';
import { ValueObject } from '../ValueObject';

export const VALID_SUBSCRIPTION_STATUSES = [
  'active', // Paid subscription
  'canceled', // User cancelled, but still has access until the end of the billing period
  'expired', // Subscription ended without renewal
  'free_trial', // User is on a free trial
  'free', // User is on a free plan
];

type SubscriptionStatusProps = {
  value: string;
};

export class SubscriptionStatus extends ValueObject<SubscriptionStatusProps> {
  private readonly _value: string;

  private constructor(props: SubscriptionStatusProps) {
    super(props);
    this._value = props.value;
  }

  public static create(value: string): SubscriptionStatus {
    if (!VALID_SUBSCRIPTION_STATUSES.includes(value)) {
      throw new ValidationError(
        `SubscriptionStatus: value must be one of [${VALID_SUBSCRIPTION_STATUSES.join(', ')}]`,
      );
    }

    return new SubscriptionStatus({ value: value });
  }

  get value(): string {
    return this._value;
  }
}
