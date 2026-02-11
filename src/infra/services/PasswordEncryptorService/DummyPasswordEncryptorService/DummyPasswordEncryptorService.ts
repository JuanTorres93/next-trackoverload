import { PasswordEncryptorService } from '@/domain/services/PasswordEncryptorService.port';

export class DummyPasswordEncryptorService implements PasswordEncryptorService {
  private readonly HASH_PREFIX = 'hashed:';

  async hashPassword(plainPassword: string): Promise<string> {
    // Simple hashing: just reverse and add a prefix
    const reversed = plainPassword.split('').reverse().join('');
    return this.HASH_PREFIX + reversed;
  }

  async plainPasswordMatchesHashed(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const hashedPlain = await this.hashPassword(plainPassword);
    return hashedPlain === hashedPassword;
  }
}
