import { waitFor } from "@testing-library/dom";

import { BottleneckRateLimiter } from "../BottleneckRateLimiter";

describe("BottleneckRateLimiter", () => {
  const REQUESTS = 5;
  const PER_MINUTES = 1;
  const TEST_CLIENT_ID = "test-client";

  let rateLimiter: BottleneckRateLimiter;

  beforeEach(() => {
    rateLimiter = new BottleneckRateLimiter(REQUESTS, PER_MINUTES);
  });

  it("should keep separate limits per client", async () => {
    for (let i = 0; i < REQUESTS; i++) {
      await rateLimiter.recordRequest("client-a");
    }

    expect(await rateLimiter.isRateLimited("client-a")).toBe(true);
    expect(await rateLimiter.isRateLimited("client-b")).toBe(false);
  });

  it("should not be rate limited initially", async () => {
    expect(await rateLimiter.isRateLimited(TEST_CLIENT_ID)).toBe(false);
  });

  it("should be rate limited after exceeding requests", async () => {
    for (let i = 0; i < REQUESTS; i++) {
      await rateLimiter.recordRequest(TEST_CLIENT_ID);
    }

    expect(await rateLimiter.isRateLimited(TEST_CLIENT_ID)).toBe(true);
  });

  it("should refill tokens after the refresh interval", async () => {
    // 1/120 minute interval = 500ms — fast enough for a test
    const SHORT_INTERVAL_MINUTES = 1 / 120;
    const fastLimiter = new BottleneckRateLimiter(
      REQUESTS,
      SHORT_INTERVAL_MINUTES,
    );

    for (let i = 0; i < REQUESTS; i++) {
      await fastLimiter.recordRequest(TEST_CLIENT_ID);
    }

    expect(await fastLimiter.isRateLimited(TEST_CLIENT_ID)).toBe(true);

    await waitFor(
      async () => {
        expect(await fastLimiter.isRateLimited(TEST_CLIENT_ID)).toBe(false);
      },
      { timeout: 2000 },
    );
  });

  it("should handle multiple rapid requests correctly", async () => {
    for (let i = 0; i < REQUESTS; i++) {
      await rateLimiter.recordRequest(TEST_CLIENT_ID);
    }

    expect(await rateLimiter.isRateLimited(TEST_CLIENT_ID)).toBe(true);
  });
});
