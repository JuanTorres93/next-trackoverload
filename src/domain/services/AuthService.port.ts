export type AuthToken = string;

export interface AuthService {
  generateToken(userId: string): AuthToken;
  validateToken(token: string): boolean;
  getCurrentUserIdFromToken(token: string): string;

  // NOTE: logout is handled at the HTTP layer by deleting the session cookie.

  // TODO IMPORTANT: change password, forgot password, etc.
}
