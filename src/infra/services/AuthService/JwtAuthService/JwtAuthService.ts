import jwt from 'jsonwebtoken';
import { AuthService, AuthToken } from '@/domain/services/AuthService.port';

type JwtPayload = {
  userId: string;
};

export class JwtAuthService implements AuthService {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: string | number = '7d',
  ) {}

  generateToken(userId: string): AuthToken {
    return jwt.sign({ userId } satisfies JwtPayload, this.secret, {
      expiresIn: this.expiresIn,
    } as jwt.SignOptions);
  }

  validateToken(token: AuthToken): boolean {
    try {
      jwt.verify(token, this.secret);
      return true;
    } catch {
      return false;
    }
  }

  getCurrentUserIdFromToken(token: AuthToken): string {
    const payload = jwt.verify(token, this.secret) as JwtPayload;
    return payload.userId;
  }
}
