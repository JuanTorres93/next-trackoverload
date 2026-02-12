import bcrypt from 'bcrypt';
import { PasswordEncryptorService } from '@/domain/services/PasswordEncryptorService.port';

export class BcryptPasswordEncryptorService implements PasswordEncryptorService {
  private readonly saltRounds: number;

  constructor(saltRounds: number = 12) {
    if (saltRounds < 10 || saltRounds > 15) {
      throw new Error(
        'BcryptPasswordEncryptorService: Salt rounds must be between 10 and 15 for security',
      );
    }
    this.saltRounds = saltRounds;
  }

  async hashPassword(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, this.saltRounds);
  }

  async plainPasswordMatchesHashed(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
