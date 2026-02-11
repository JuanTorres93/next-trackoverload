import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { User, UserCreateProps } from '@/domain/entities/user/User';
import fs from 'fs/promises';
import path from 'path';
import { FS_DATA_DIR } from './common';

type UserPersistence = {
  id: string;
  name: string;
  email: string;
  hashedPassword: string;
  customerId?: string;
  createdAt: string;
  updatedAt: string;
};

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

  private serializeUser(user: User): UserPersistence {
    const props = user.toCreateProps();
    return {
      id: props.id,
      name: props.name,
      email: props.email,
      hashedPassword: props.hashedPassword,
      customerId: props.customerId,
      createdAt: props.createdAt?.toISOString() ?? new Date().toISOString(),
      updatedAt: props.updatedAt?.toISOString() ?? new Date().toISOString(),
    };
  }

  private deserializeUser(data: UserPersistence): User {
    const props: UserCreateProps = {
      id: data.id,
      name: data.name,
      email: data.email,
      hashedPassword: data.hashedPassword,
      customerId: data.customerId,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
    return User.create(props);
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
          const data = JSON.parse(content) as UserPersistence;
          return this.deserializeUser(data);
        }),
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
      const data = JSON.parse(content) as UserPersistence;
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
