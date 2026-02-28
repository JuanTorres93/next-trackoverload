import { SESSION_DURATION_IN_DAYS } from '@/domain/services/AuthService.port';

export const cookieSessionName = 'token';
export const cookieSessionMaxAgeInSeconds =
  60 * 60 * 24 * SESSION_DURATION_IN_DAYS;
