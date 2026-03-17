import { SubscriptionStatus } from '@/domain/value-objects/SubscriptionStatus/SubscriptionStatus';

export type PlanInfo = {
  title: string;
  description: string;
  priceInEurCents: number;
};

export const FREE_TRIAL_DAYS = 14;

export interface PaymentsService {
  createSubscription(
    email: string,
    name: string,
    planId: string,
  ): Promise<{ redirectUrl: string; customerId: string }>;

  cancelSubscription(customerId: string): Promise<{ redirectUrl: string }>;

  resumeSubscription(customerId: string): Promise<{ redirectUrl: string }>;

  getSubscriptionStatus(customerId: string): Promise<SubscriptionStatus | null>;

  getPlanInfo(): Promise<PlanInfo>;
}
