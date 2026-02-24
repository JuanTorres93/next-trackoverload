import { jwtVerify, SignJWT } from 'jose';
import { AuthService, AuthToken } from '@/domain/services/AuthService.port';

type JwtPayload = {
  userId: string;
};

export class JwtAuthService implements AuthService {
  private readonly secretKey: Uint8Array;

  constructor(
    secret: string,
    private readonly expiresIn: string | number = '7d',
  ) {
    this.secretKey = new TextEncoder().encode(secret);
  }

  async generateToken(userId: string): Promise<AuthToken> {
    return new SignJWT({ userId } satisfies JwtPayload)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(this.expiresIn)
      .sign(this.secretKey);
  }

  async validateToken(token: AuthToken): Promise<boolean> {
    try {
      await jwtVerify(token, this.secretKey);
      return true;
    } catch {
      return false;
    }
  }

  async getCurrentUserIdFromToken(token: AuthToken): Promise<string> {
    const { payload } = await jwtVerify(token, this.secretKey);
    return (payload as unknown as JwtPayload).userId;
  }
}
