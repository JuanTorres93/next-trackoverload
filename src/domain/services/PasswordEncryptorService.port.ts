export interface PasswordEncryptorService {
  hashPassword(plainPassword: string): Promise<string>;
  plainPasswordMatchesHashed(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
