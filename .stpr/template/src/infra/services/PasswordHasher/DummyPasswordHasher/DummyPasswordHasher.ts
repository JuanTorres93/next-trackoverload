import { PasswordHasher } from '@/application-layer/services/PasswordHasher';

export class DummyPasswordHasher implements PasswordHasher {
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
