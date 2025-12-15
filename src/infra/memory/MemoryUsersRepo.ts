import { User } from '@/domain/entities/user/User';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export class MemoryUsersRepo implements UsersRepo {
  private users: User[] = [];

  async getAllUsers(): Promise<User[]> {
    return [...this.users];
  }

  async getUserById(id: string): Promise<User | null> {
    const user = this.users.find((u) => u.id === id);
    return user || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = this.users.find((u) => u.email === email);
    return user || null;
  }

  async deleteUser(id: string): Promise<void> {
    const index = this.users.findIndex((u) => u.id === id);
    // NOTE: Throw error in use case in order not to have false positives in tests
    if (index === -1) return Promise.reject(null);

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

  // IMPORTANT NOTE: Helper method for testing - not part of the interface
  clearForTesting(): void {
    this.users = [];
  }

  // IMPORTANT NOTE: Helper method for testing - not part of the interface
  countForTesting(): number {
    return this.users.length;
  }

  // IMPORTANT NOTE: Helper method for testing - not part of the interface
  getAllForTesting(): User[] {
    return [...this.users];
  }
}
