export type AuthToken = string;

export interface AuthService {
  generateToken(userId: string): AuthToken;
  validateToken(token: string): boolean;
  revokeToken(token: string): void;

  getCurrentUserIdFromToken(token: string): string;

  // TODO IMPORTANT: change password, forgot password, etc.
}
