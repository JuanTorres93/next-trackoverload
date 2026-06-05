export interface PasswordHasher {
  hashPassword(plainPassword: string): Promise<string>;

  plainPasswordMatchesHashed(plainPassword: string, hashedPassword: string): Promise<boolean>;
}
