import { AuthService, AuthToken } from '@/domain/services/AuthService.port';

type TokenData = {
  userId: string;
  createdAt: number;
  nonce: string;
};

export class MemoryAuthService implements AuthService {
  private revokedTokens: Set<string> = new Set();

  async generateToken(userId: string): Promise<AuthToken> {
    const tokenData: TokenData = {
      userId,
      createdAt: Date.now(),
      nonce: Math.random().toString(36).substring(2, 15),
    };

    return Buffer.from(JSON.stringify(tokenData)).toString('base64');
  }

  async validateToken(token: AuthToken): Promise<boolean> {
    if (this.revokedTokens.has(token)) {
      return false;
    }

    try {
      const decoded = this.decodeTokenData(token);
      return decoded !== null && decoded.userId !== undefined;
    } catch {
      return false;
    }
  }

  revokeToken(token: AuthToken): void {
    this.revokedTokens.add(token);
  }

  async getCurrentUserIdFromToken(token: AuthToken): Promise<string> {
    if (!(await this.validateToken(token))) {
      throw new Error('Invalid or revoked token');
    }

    const decoded = this.decodeTokenData(token);
    if (!decoded) {
      throw new Error('Invalid token format');
    }

    return decoded.userId;
  }

  private decodeTokenData(token: AuthToken): TokenData | null {
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const data = JSON.parse(decoded) as TokenData;

      if (!data.userId || !data.createdAt || !data.nonce) {
        return null;
      }

      return data;
    } catch {
      return null;
    }
  }

  // Helper methods for testing
  clearRevokedTokensForTesting(): void {
    this.revokedTokens.clear();
  }

  getRevokedTokensCountForTesting(): number {
    return this.revokedTokens.size;
  }
}
