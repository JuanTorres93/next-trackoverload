import { PaymentsService } from '@/domain/services/PaymentsService.port';
import { SubscriptionStatus } from '@/domain/value-objects/SubscriptionStatus/SubscriptionStatus';

export class MemoryPaymentsService implements PaymentsService {
  async createSubscription(
    _email: string,
    _name: string,
    planId: string,
  ): Promise<{ redirectUrl: string; customerId: string }> {
    const customerId = `mem-customer-${planId}`;
    return {
      redirectUrl: `https://checkout.example.com/${planId}`,
      customerId,
    };
  }

  async cancelSubscription(
    customerId: string,
  ): Promise<{ redirectUrl: string }> {
    return { redirectUrl: `https://billing.example.com/${customerId}` };
  }

  async getSubscriptionStatus(
    _customerId: string,
  ): Promise<SubscriptionStatus | null> {
    return null;
  }
}
