import { MemoryAuthService } from '@/infra/services/AuthService/MemoryAuthService/MemoryAuthService';
import { JwtAuthService } from '@/infra/services/AuthService/JwtAuthService/JwtAuthService';

let AppAuthService: JwtAuthService | MemoryAuthService;

if (process.env.NODE_ENV === 'test') {
  AppAuthService = new MemoryAuthService();
} else {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      'AppAuthService: JWT_SECRET environment variable is not set',
    );
  }
  AppAuthService = new JwtAuthService(secret);
}

export { AppAuthService };
