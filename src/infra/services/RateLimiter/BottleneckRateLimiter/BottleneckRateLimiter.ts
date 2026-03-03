import Bottleneck from 'bottleneck';
import { RateLimiter } from '@/domain/services/RateLimiter.port';

export class BottleneckRateLimiter implements RateLimiter {
  private readonly limiter: Bottleneck;

  constructor(requests: number, perMinutes: number) {
    this.limiter = new Bottleneck({
      reservoir: requests,
      reservoirRefreshAmount: requests,
      reservoirRefreshInterval: perMinutes * 60 * 1000,
    });
  }

  async isRateLimited(): Promise<boolean> {
    const reservoir = await this.limiter.currentReservoir();
    return reservoir !== null && reservoir <= 0;
  }

  async recordRequest(): Promise<void> {
    await this.limiter.incrementReservoir(-1);
  }
}
