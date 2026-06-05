import { UserMatches } from '@/domain/entities/usermatches/UserMatches';
import { UserMatchesRepo } from '@/domain/repos/UserMatchesRepo.port';

export class MemoryUserMatchesRepo implements UserMatchesRepo {
  private userMatches: Map<string, UserMatches> = new Map();

  async save(userMatches: UserMatches): Promise<void> {
    this.userMatches.set(userMatches.id, userMatches);
  }

  async getAll() {
    return [...Array.from(this.userMatches.values())];
  }

  async getByUserId(userId: string) {
    const userMatches = Array.from(this.userMatches.values()).find(
      (matches) => matches.userId === userId,
    );

    if (!userMatches) {
      return null;
    }

    return UserMatches.create(userMatches.toCreateProps());
  }

  async deleteByUserId(userId: string): Promise<void> {
    const userMatches = Array.from(this.userMatches.values()).find(
      (matches) => matches.userId === userId,
    );

    if (userMatches) {
      this.userMatches.delete(userMatches.id);
    }
  }

  clearAllForTesting() {
    this.userMatches.clear();
  }
}
