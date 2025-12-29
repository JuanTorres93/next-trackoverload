export interface RateLimiter {
  isRateLimited(): Promise<boolean>;
  recordRequest(): Promise<void>;
}
