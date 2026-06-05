import { User } from '../../../domain/entities/user/User';
import { UsersRepo } from '../../../domain/repos/UsersRepo.port';

export class MemoryUsersRepo implements UsersRepo {
  private users: Map<string, User> = new Map();

  async save(user: User): Promise<void> {
    this.users.set(user.id, user);
  }

  async getAll() {
    return [...Array.from(this.users.values())];
  }

  async getById(id: string) {
    const user = this.users.get(id);

    if (!user) {
      return null;
    }

    return User.create(user.toCreateProps());
  }

  async getByEmail(email: string) {
    const user = [...Array.from(this.users.values())].find((user) => user.email === email);

    if (!user) {
      return null;
    }

    return User.create(user.toCreateProps());
  }

  async deleteById(id: string): Promise<void> {
    this.users.delete(id);
  }

  clearAllForTesting() {
    this.users.clear();
  }
}
