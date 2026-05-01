export interface RateLimiter {
  isRateLimited(clientId: string): Promise<boolean>;
  recordRequest(clientId: string): Promise<void>;
}
