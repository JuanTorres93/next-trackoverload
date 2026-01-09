import { RateLimiter } from '@/domain/services/RateLimiter.port';

export class MemoryTokenBucketRateLimiter implements RateLimiter {
  private requests: number;
  private readonly capacity: number;
  private lastRefill: number;
  private refillRatePerMinute: number;

  constructor(requests: number, perMinutes: number) {
    this.requests = requests;
    this.capacity = requests;
    this.refillRatePerMinute = requests / perMinutes;
    this.lastRefill = Date.now();
  }

  async isRateLimited(): Promise<boolean> {
    this._refillTokens();
    return this.requests <= 0;
  }

  async recordRequest(): Promise<void> {
    this._refillTokens();

    if (this.requests > 0) {
      this.requests -= 1;
    }
  }

  private _refillTokens() {
    const now = Date.now();
    const minutesPassed = (now - this.lastRefill) / 60000;

    const extraTokens = Math.floor(minutesPassed * this.refillRatePerMinute);

    if (extraTokens > 0) {
      this.lastRefill = now;

      const updatedTokens = this.requests + extraTokens;
      this.requests =
        updatedTokens > this.capacity ? this.capacity : updatedTokens;
    }
  }
}
