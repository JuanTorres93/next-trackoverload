import { SubscriptionStatus } from '@/domain/value-objects/SubscriptionStatus/SubscriptionStatus';

export interface PaymentsService {
  createSubscription(
    email: string,
    name: string,
    planId: string,
  ): Promise<{ redirectUrl: string; customerId: string }>;

  cancelSubscription(customerId: string): Promise<{ redirectUrl: string }>;

  getSubscriptionStatus(customerId: string): Promise<SubscriptionStatus | null>;
}
