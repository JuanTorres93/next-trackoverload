export interface PaymentsService {
  createSubscription(userId: string, planId: string): Promise<void>;
  cancelSubscription(userId: string): Promise<void>;
  getSubscriptionStatus(userId: string): Promise<string>;
}
