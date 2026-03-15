// @vitest-environment node
// Load env variables for real Stripe API calls
import 'dotenv/config';

import Stripe from 'stripe';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { StripePaymentsService } from '../StripePaymentsService';

const hasStripeCredentials = Boolean(
  process.env.STRIPE_SECRET && process.env.STRIPE_PRICE_ID,
);
const isCI = Boolean(process.env.CI || process.env.GITHUB_ACTIONS);
const shouldSkip = isCI && !hasStripeCredentials;

const TEST_EMAIL = 'test@example.com';
const TEST_NAME = 'Test User';

describe.skipIf(shouldSkip)('StripePaymentsService', () => {
  let stripe: Stripe;
  let service: StripePaymentsService;
  let createdCustomerIds: string[];

  beforeAll(() => {
    stripe = new Stripe(process.env.STRIPE_SECRET!);
  });

  beforeEach(() => {
    service = new StripePaymentsService();
    createdCustomerIds = [];
  });

  afterAll(async () => {
    for (const customerId of createdCustomerIds) {
      await stripe.customers.del(customerId);
    }
  });

  describe('createSubscription', () => {
    it('creates a Stripe customer and returns a checkout session URL', async () => {
      const result = await service.createSubscription(
        TEST_EMAIL,
        TEST_NAME,
        process.env.STRIPE_PRICE_ID!,
      );

      expect(result.redirectUrl).toMatch(/^https:\/\/checkout\.stripe\.com/);

      // Capture the created customer for cleanup
      const customers = await stripe.customers.list({
        email: TEST_EMAIL,
        limit: 1,
      });
      if (customers.data[0]) createdCustomerIds.push(customers.data[0].id);
    });

    it('throws if the price ID does not exist', async () => {
      await expect(
        service.createSubscription(TEST_EMAIL, TEST_NAME, 'price_nonexistent'),
      ).rejects.toThrow();

      const customers = await stripe.customers.list({
        email: TEST_EMAIL,
        limit: 1,
      });
      if (customers.data[0]) createdCustomerIds.push(customers.data[0].id);
    });
  });

  describe('cancelSubscription', () => {
    it('returns a billing portal URL', async () => {
      const customer = await stripe.customers.create({ email: TEST_EMAIL });
      createdCustomerIds.push(customer.id);

      const result = await service.cancelSubscription(customer.id);

      expect(result.redirectUrl).toMatch(/^https:\/\/billing\.stripe\.com/);
    });
  });

  describe('getSubscriptionStatus', () => {
    it('returns null if the customer has no subscriptions', async () => {
      const customer = await stripe.customers.create({ email: TEST_EMAIL });
      createdCustomerIds.push(customer.id);

      const status = await service.getSubscriptionStatus(customer.id);

      expect(status).toBeNull();
    });
  });
});
