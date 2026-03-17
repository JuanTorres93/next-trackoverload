import Stripe from 'stripe';

import { InfrastructureError } from '@/domain/common/errors';
import {
  PaymentsService,
  PlanInfo,
} from '@/domain/services/PaymentsService.port';
import { SubscriptionStatus } from '@/domain/value-objects/SubscriptionStatus/SubscriptionStatus';

let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (!_stripe) _stripe = new Stripe(process.env.STRIPE_SECRET!);
  return _stripe;
}
const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

export function toSubscriptionStatus(
  subscription: Stripe.Subscription,
): SubscriptionStatus {
  if (subscription.status === 'trialing')
    return SubscriptionStatus.create('free_trial');

  if (subscription.status === 'canceled')
    return SubscriptionStatus.create('expired');

  if (
    subscription.status === 'active' &&
    (subscription.cancel_at_period_end || subscription.cancel_at !== null)
  )
    return SubscriptionStatus.create('canceled');

  if (subscription.status === 'active')
    return SubscriptionStatus.create('active');

  throw new InfrastructureError(
    `StripePaymentsService: unhandled Stripe subscription status '${subscription.status}'`,
  );
}

export class StripePaymentsService implements PaymentsService {
  private async createCustomer(email: string, name: string): Promise<string> {
    const customer = await getStripe().customers.create({
      email,
      name,
      preferred_locales: ['es'],
    });

    return customer.id;
  }

  async createSubscription(
    email: string,
    name: string,
    planId: string,
  ): Promise<{ redirectUrl: string; customerId: string }> {
    const customerId = await this.createCustomer(email, name);

    const session = await getStripe().checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      locale: 'es',
      line_items: [{ price: planId, quantity: 1 }],
      success_url: `${appUrl}/app/subscription?success=true`,
      cancel_url: `${appUrl}/app/subscription`,
    });

    if (!session.url)
      throw new InfrastructureError(
        'StripePaymentsService: checkout session URL is null',
      );

    return { redirectUrl: session.url, customerId };
  }

  async cancelSubscription(
    customerId: string,
  ): Promise<{ redirectUrl: string }> {
    const session = await getStripe().billingPortal.sessions.create({
      customer: customerId,
      locale: 'es',
      return_url: `${appUrl}/app/subscription`,
    });

    return { redirectUrl: session.url };
  }

  async resumeSubscription(
    customerId: string,
  ): Promise<{ redirectUrl: string }> {
    const session = await getStripe().billingPortal.sessions.create({
      customer: customerId,
      locale: 'es',
      return_url: `${appUrl}/app/subscription`,
    });

    return { redirectUrl: session.url };
  }

  async getSubscriptionStatus(
    customerId: string,
  ): Promise<SubscriptionStatus | null> {
    const { data: subscriptions } = await getStripe().subscriptions.list({
      customer: customerId,
      limit: 1,
    });

    if (!subscriptions[0]) return null;

    return toSubscriptionStatus(subscriptions[0]);
  }

  async getPlanInfo(): Promise<PlanInfo> {
    const priceId = process.env.STRIPE_PRICE_ID!;

    const price = await getStripe().prices.retrieve(priceId, {
      expand: ['product'],
    });

    const product = price.product;

    const title =
      typeof product === 'object' && 'name' in product ? product.name : '';

    const description =
      typeof product === 'object' && 'description' in product
        ? (product.description ?? '')
        : '';

    return { title, description, priceInEurCents: price.unit_amount ?? 0 };
  }
}
