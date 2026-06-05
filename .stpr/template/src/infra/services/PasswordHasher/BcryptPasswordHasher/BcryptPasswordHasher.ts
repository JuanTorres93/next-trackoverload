import bcrypt from 'bcrypt';

import { PasswordHasher } from '@/application-layer/services/PasswordHasher';

export class BcryptPasswordHasher implements PasswordHasher {
  private readonly saltRounds: number;

  constructor(saltRounds: number = 12) {
    if (saltRounds < 10 || saltRounds > 15) {
      throw new Error('BcryptPasswordHasher: Salt rounds must be between 10 and 15 for security');
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
