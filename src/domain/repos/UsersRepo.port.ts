import { User } from '../user/User';

export interface UsersRepo {
  getAllUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  // NOTE: implement deletion in Auth?
  deleteUser(id: string): Promise<void>;

  // saveUser is implemented in Auth
  // saveUser(user: User): Promise<void>;
}
