import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { Id } from '@/domain/types/Id/Id';
import { User } from '@/domain/entities/user/User';
import { UserDTO, toUserDTO } from '@/application-layer/dtos/UserDTO';
import { BaseFileSystemRepo } from './BaseFileSystemRepo';

export class FileSystemUsersRepo
  extends BaseFileSystemRepo<User>
  implements UsersRepo
{
  constructor() {
    super('users.json');
  }

  protected getItemId(item: User): string {
    return item.id;
  }

  protected serializeItems(items: User[]): UserDTO[] {
    return items.map(toUserDTO);
  }

  protected deserializeItems(data: unknown[]): User[] {
    return (data as UserDTO[]).map((item) =>
      User.create({
        ...item,
        id: Id.create(item.id),
        customerId: item.customerId ? Id.create(item.customerId) : undefined,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      })
    );
  }

  async saveUser(user: User): Promise<void> {
    return this.saveItem(user);
  }

  async getAllUsers(): Promise<User[]> {
    return this.getAllItems();
  }

  async getUserById(id: string): Promise<User | null> {
    return this.getItemById(id);
  }

  async deleteUser(id: string): Promise<void> {
    return this.deleteItemById(id);
  }
}
