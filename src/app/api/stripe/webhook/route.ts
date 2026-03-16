import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { AppSyncUserSubscriptionStatusUsecase } from '@/interface-adapters/app/use-cases/subscription';
import { toSubscriptionStatus } from '@/infra/services/PaymentsService/StripePaymentsService/StripePaymentsService';

const stripe = new Stripe(process.env.STRIPE_SECRET!);

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 },
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set');
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 },
    );
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;

      const customerId =
        typeof subscription.customer === 'string'
          ? subscription.customer
          : subscription.customer.id;

      const item = subscription.items.data[0];
      const subscriptionEndsAt = item
        ? new Date(item.current_period_end * 1000)
        : undefined;

      await AppSyncUserSubscriptionStatusUsecase.execute({
        customerId,
        subscriptionStatus: toSubscriptionStatus(subscription).value,
        subscriptionEndsAt,
      });
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
