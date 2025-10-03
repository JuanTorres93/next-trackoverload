import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { User } from '@/domain/entities/user/User';
import { NotFoundError } from '@/domain/common/errors';

export class MemoryUsersRepo implements UsersRepo {
  private users: User[] = [];

  async getAllUsers(): Promise<User[]> {
    return [...this.users];
  }

  async getUserById(id: string): Promise<User | null> {
    const user = this.users.find((u) => u.id === id);
    return user || null;
  }

  async deleteUser(id: string): Promise<void> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1)
      throw new NotFoundError('MemoryUsersRepo: User not found');

    this.users.splice(index, 1);
  }

  // IMPORTANT NOTE: Helper method for testing - not part of the interface
  async saveUser(user: User): Promise<void> {
    const existingIndex = this.users.findIndex((u) => u.id === user.id);

    if (existingIndex !== -1) {
      this.users[existingIndex] = user;
    } else {
      this.users.push(user);
    }
  }
}
