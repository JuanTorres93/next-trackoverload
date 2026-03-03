import Bottleneck from 'bottleneck';
import { RateLimiter } from '@/domain/services/RateLimiter.port';

export class BottleneckRateLimiter implements RateLimiter {
  private readonly group: Bottleneck.Group;

  constructor(requests: number, perMinutes: number) {
    this.group = new Bottleneck.Group({
      reservoir: requests,
      reservoirRefreshAmount: requests,
      reservoirRefreshInterval: perMinutes * 60 * 1000,
    });
  }

  async isRateLimited(clientId: string): Promise<boolean> {
    const limiter = this.group.key(clientId);
    const reservoir = await limiter.currentReservoir();
    return reservoir !== null && reservoir <= 0;
  }

  async recordRequest(clientId: string): Promise<void> {
    const limiter = this.group.key(clientId);
    await limiter.incrementReservoir(-1);
  }
}
