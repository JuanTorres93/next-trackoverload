import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { User } from '@/domain/entities/user/User';
import { UserDTO } from '@/application-layer/dtos/UserDTO';
import fs from 'fs/promises';
import path from 'path';
import { FS_DATA_DIR } from './common';

export class FileSystemUsersRepo implements UsersRepo {
  private readonly dataDir: string;

  constructor(baseDir: string = path.join(FS_DATA_DIR, 'users')) {
    this.dataDir = baseDir;
  }

  private async ensureDataDir(): Promise<void> {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
    } catch {
      // Directory might already exist
    }
  }

  private getFilePath(id: string): string {
    return path.join(this.dataDir, `${id}.json`);
  }

  private serializeUser(user: User): UserDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      customerId: user.customerId,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  private deserializeUser(data: UserDTO): User {
    return User.create({
      id: data.id,
      name: data.name,
      email: data.email,
      customerId: data.customerId,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
  }

  async saveUser(user: User): Promise<void> {
    await this.ensureDataDir();
    const data = this.serializeUser(user);
    const filePath = this.getFilePath(user.id);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  }

  async getAllUsers(): Promise<User[]> {
    await this.ensureDataDir();

    try {
      const files = await fs.readdir(this.dataDir);
      const jsonFiles = files.filter((f) => f.endsWith('.json'));

      const users = await Promise.all(
        jsonFiles.map(async (file) => {
          const filePath = path.join(this.dataDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const data = JSON.parse(content) as UserDTO;
          return this.deserializeUser(data);
        })
      );

      return users;
    } catch {
      return [];
    }
  }

  async getUserById(id: string): Promise<User | null> {
    const filePath = this.getFilePath(id);

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content) as UserDTO;
      return this.deserializeUser(data);
    } catch {
      return null;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const users = await this.getAllUsers();
    const user = users.find((u) => u.email === email);
    return user || null;
  }

  async getUserByCustomerId(customerId: string): Promise<User | null> {
    const users = await this.getAllUsers();
    const user = users.find((u) => u.customerId === customerId);
    return user || null;
  }

  async deleteUser(id: string): Promise<void> {
    const filePath = this.getFilePath(id);

    try {
      await fs.unlink(filePath);
    } catch {
      // File might not exist, consistent with memory repo
    }
  }
}
