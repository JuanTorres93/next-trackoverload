import { UserMatches } from '../entities/usermatches/UserMatches';

export interface UserMatchesRepo {
  getAll(): Promise<UserMatches[]>;
  getByUserId(userId: string): Promise<UserMatches | null>;

  save(userMatches: UserMatches): Promise<void>;

  deleteByUserId(userId: string): Promise<void>;
}
