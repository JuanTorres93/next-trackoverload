import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryUsersRepo } from '../MemoryUsersRepo';
import { User } from '@/domain/entities/user/User';

const validUserProps = {
  id: '1',
  name: 'John Doe',
  customerId: 'customer-1',
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
};

describe('MemoryUsersRepo', () => {
  let repo: MemoryUsersRepo;
  let user: User;

  beforeEach(async () => {
    repo = new MemoryUsersRepo();
    user = User.create(validUserProps);
    await repo.saveUser(user); // IMPORTANT NOTE: Using helper method for testing, actual saving of users will be done in Auth
  });

  it('should retrieve all users', async () => {
    const newUser = User.create({
      id: '2',
      name: 'Jane Doe',
      customerId: 'customer-2',
      createdAt: new Date('2023-01-02'),
      updatedAt: new Date('2023-01-02'),
    });
    await repo.saveUser(newUser);

    const allUsers = await repo.getAllUsers();
    expect(allUsers.length).toBe(2);
    expect(allUsers[0].name).toBe('John Doe');
    expect(allUsers[1].name).toBe('Jane Doe');
  });

  it('should retrieve a user by ID', async () => {
    const fetchedUser = await repo.getUserById('1');
    expect(fetchedUser).not.toBeNull();
    expect(fetchedUser?.name).toBe('John Doe');
  });

  it('should return null for non-existent user ID', async () => {
    const fetchedUser = await repo.getUserById('non-existent-id');
    expect(fetchedUser).toBeNull();
  });

  it('should delete a user by ID', async () => {
    const allUsers = await repo.getAllUsers();
    expect(allUsers.length).toBe(1);

    await repo.deleteUser('1');

    const allUsersAfterDeletion = await repo.getAllUsers();
    expect(allUsersAfterDeletion.length).toBe(0);
  });
});
