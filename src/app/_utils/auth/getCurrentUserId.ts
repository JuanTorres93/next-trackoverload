import { cookies } from 'next/headers';

import { cookieSessionName } from '@/app/api/auth/cookie';
import { AppAuthService } from '@/interface-adapters/app/services/AppAuthService';

/**
 * Reads the session cookie and returns the authenticated user's ID.
 * Only call this from server-side code (Server Actions, Server Components, Route Handlers).
 * The middleware at /app/* guarantees the token exists and is valid.
 */
export async function getCurrentUserId(): Promise<string> {
  const cookieStore = await cookies();

  const token = cookieStore.get(cookieSessionName)!.value;

  return AppAuthService.getCurrentUserIdFromToken(token);
}
