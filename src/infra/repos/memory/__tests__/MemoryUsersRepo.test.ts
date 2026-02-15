import * as userTestProps from '../../../../../tests/createProps/userTestProps';
import { User } from '@/domain/entities/user/User';
import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryUsersRepo } from '../MemoryUsersRepo';

describe('MemoryUsersRepo', () => {
  let repo: MemoryUsersRepo;
  let user: User;

  beforeEach(async () => {
    repo = new MemoryUsersRepo();

    user = userTestProps.createTestUser();

    await repo.saveUser(user);
  });

  it('should retrieve all users', async () => {
    const newUser = userTestProps.createTestUser({
      id: 'another-user-id',
      name: 'Jane Doe',
      customerId: 'another-customer-id',
    });
    await repo.saveUser(newUser);

    const allUsers = await repo.getAllUsers();
    expect(allUsers.length).toBe(2);
    expect(allUsers[0].name).toBe(user.name);
    expect(allUsers[1].name).toBe('Jane Doe');
  });

  it('should retrieve a user by ID', async () => {
    const fetchedUser = await repo.getUserById(user.id);
    expect(fetchedUser).not.toBeNull();
    expect(fetchedUser?.name).toBe(user.name);
  });

  it('should retrieve a user by email', async () => {
    const fetchedUser = await repo.getUserByEmail(user.email);
    expect(fetchedUser).not.toBeNull();
    expect(fetchedUser?.email).toBe(user.email);
    expect(fetchedUser?.name).toBe(user.name);
  });

  it('should return null for non-existent email', async () => {
    const fetchedUser = await repo.getUserByEmail('non-existent@example.com');
    expect(fetchedUser).toBeNull();
  });

  it('should retrieve a user by customerId', async () => {
    const fetchedUser = await repo.getUserByCustomerId(user.customerId!);
    expect(fetchedUser).not.toBeNull();
    expect(fetchedUser?.customerId).toBe(user.customerId);
    expect(fetchedUser?.name).toBe(user.name);
  });

  it('should return null for non-existent customerId', async () => {
    const fetchedUser = await repo.getUserByCustomerId(
      'non-existent-customer-id',
    );
    expect(fetchedUser).toBeNull();
  });

  it('should return null for non-existent user ID', async () => {
    const fetchedUser = await repo.getUserById('non-existent-id');
    expect(fetchedUser).toBeNull();
  });

  it('should delete a user by ID', async () => {
    const allUsers = await repo.getAllUsers();
    expect(allUsers.length).toBe(1);

    await repo.deleteUser(user.id);
    const allUsersAfterDeletion = await repo.getAllUsers();
    expect(allUsersAfterDeletion.length).toBe(0);
  });
});
