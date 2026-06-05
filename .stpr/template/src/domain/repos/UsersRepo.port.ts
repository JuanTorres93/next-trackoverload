import { User } from '../entities/user/User';

export interface UsersRepo {
  getAll(): Promise<User[]>;
  getById(id: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;

  save(user: User): Promise<void>;

  deleteById(id: string): Promise<void>;
}
