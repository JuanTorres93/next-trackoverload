import { RateLimiter } from '@/domain/services/RateLimiter.port';

type Bucket = {
  requests: number;
  lastRefill: number;
};

export class MemoryTokenBucketRateLimiter implements RateLimiter {
  private readonly capacity: number;
  private readonly refillRatePerMinute: number;
  private readonly clientBuckets: Map<string, Bucket> = new Map();

  constructor(requests: number, perMinutes: number) {
    this.capacity = requests;
    this.refillRatePerMinute = requests / perMinutes;
  }

  private _getBucket(clientId: string): Bucket {
    if (!this.clientBuckets.has(clientId)) {
      this.clientBuckets.set(clientId, {
        requests: this.capacity,
        lastRefill: Date.now(),
      });
    }
    return this.clientBuckets.get(clientId)!;
  }

  async isRateLimited(clientId: string): Promise<boolean> {
    const bucket = this._getBucket(clientId);
    this._refillTokens(bucket);
    return bucket.requests <= 0;
  }

  async recordRequest(clientId: string): Promise<void> {
    const bucket = this._getBucket(clientId);
    this._refillTokens(bucket);

    if (bucket.requests > 0) {
      bucket.requests -= 1;
    }
  }

  private _refillTokens(bucket: Bucket) {
    const now = Date.now();
    const minutesPassed = (now - bucket.lastRefill) / 60000;

    const extraTokens = Math.floor(minutesPassed * this.refillRatePerMinute);

    if (extraTokens > 0) {
      bucket.lastRefill = now;

      const updatedTokens = bucket.requests + extraTokens;
      bucket.requests =
        updatedTokens > this.capacity ? this.capacity : updatedTokens;
    }
  }
}
