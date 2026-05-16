import { MemoryTokenBucketRateLimiter } from '../MemoryTokenBucketRateLimiter';

describe('MemoryTokenBucketRateLimiter', () => {
  let requests: number;
  let perMinutes: number;
  let rateLimiter: MemoryTokenBucketRateLimiter;

  const TEST_CLIENT_ID = 'test-client';

  beforeEach(() => {
    requests = 5;
    perMinutes = 1;
    rateLimiter = new MemoryTokenBucketRateLimiter(requests, perMinutes);
  });

  it('should not be rate limited initially', async () => {
    const isLimited = await rateLimiter.isRateLimited(TEST_CLIENT_ID);
    expect(isLimited).toBe(false);
  });

  it('should be rate limited after exceeding requests', async () => {
    for (let i = 0; i < requests; i++) {
      await rateLimiter.recordRequest(TEST_CLIENT_ID);
    }
    const isLimited = await rateLimiter.isRateLimited(TEST_CLIENT_ID);
    expect(isLimited).toBe(true);
  });

  it('should keep separate limits per client', async () => {
    for (let i = 0; i < requests; i++) {
      await rateLimiter.recordRequest('client-a');
    }
    expect(await rateLimiter.isRateLimited('client-a')).toBe(true);
    expect(await rateLimiter.isRateLimited('client-b')).toBe(false);
  });

  it('should refill tokens over time', async () => {
    const veryPermissiveRateLimiter = new MemoryTokenBucketRateLimiter(
      100000,
      1,
    ); // 100_000 requests per minute

    const SPENT_TOKENS = 100;

    // Make some requests
    for (let i = 0; i < SPENT_TOKENS; i++) {
      await veryPermissiveRateLimiter.recordRequest(TEST_CLIENT_ID);
    }

    expect(await veryPermissiveRateLimiter.isRateLimited(TEST_CLIENT_ID)).toBe(
      false,
    );

    // Wait to allow some tokens to refill
    await new Promise((resolve) => setTimeout(resolve, 100));

    // After waiting, it should still not be rate limited
    expect(await veryPermissiveRateLimiter.isRateLimited(TEST_CLIENT_ID)).toBe(
      false,
    );

    // And have more tokens available
    expect(
      veryPermissiveRateLimiter['clientBuckets'].get(TEST_CLIENT_ID)!.requests,
    ).toBeGreaterThan(100000 - SPENT_TOKENS);
  });

  it('should not exceed capacity when refilling', async () => {
    const veryPermissiveRateLimiter = new MemoryTokenBucketRateLimiter(
      100000,
      1,
    );

    // Spend 1 token
    veryPermissiveRateLimiter.recordRequest(TEST_CLIENT_ID);

    // Wait to allow tokens to refill
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Check that tokens do not exceed capacity
    expect(
      veryPermissiveRateLimiter['clientBuckets'].get(TEST_CLIENT_ID)!.requests,
    ).toBe(99999);
  });

  it('should handle multiple rapid requests correctly', async () => {
    const requestsPerMinute = 60;
    const rateLimiter = new MemoryTokenBucketRateLimiter(requestsPerMinute, 1);

    // Make 5 rapid requests
    for (let i = 0; i < requestsPerMinute; i++) {
      await rateLimiter.recordRequest(TEST_CLIENT_ID);
    }

    // Should be rate limited now
    expect(await rateLimiter.isRateLimited(TEST_CLIENT_ID)).toBe(true);

    // Wait to allow some tokens to refill
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Should not be rate limited after waiting
    expect(await rateLimiter.isRateLimited(TEST_CLIENT_ID)).toBe(false);
  });
});
