export type AuthToken = string;

export const SESSION_DURATION_IN_DAYS = 7;

export interface AuthService {
  generateToken(userId: string): Promise<AuthToken>;
  validateToken(token: string): Promise<boolean>;
  getCurrentUserIdFromToken(token: string): Promise<string>;

  // NOTE: logout is handled at the HTTP layer by deleting the session cookie.

  // TODO IMPORTANT: change password, forgot password, etc.
}
