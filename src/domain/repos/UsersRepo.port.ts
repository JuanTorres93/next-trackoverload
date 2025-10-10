import { User } from '../entities/user/User';

export interface UsersRepo {
  getAllUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  // NOTE: implement deletion in Auth?
  deleteUser(id: string): Promise<void>;
  saveUser(user: User): Promise<void>;
}
