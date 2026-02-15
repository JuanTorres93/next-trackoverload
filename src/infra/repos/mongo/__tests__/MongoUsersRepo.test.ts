import * as userTestProps from '../../../../../tests/createProps/userTestProps';
import { User } from '@/domain/entities/user/User';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { MongoUsersRepo } from '../MongoUsersRepo';
import {
  setupMongoTestDB,
  teardownMongoTestDB,
  clearMongoTestDB,
} from './setupMongoTestDB';

describe('MongoUsersRepo', () => {
  let repo: MongoUsersRepo;
  let user: User;

  beforeAll(async () => {
    await setupMongoTestDB();
  });

  beforeEach(async () => {
    await clearMongoTestDB();

    repo = new MongoUsersRepo();

    user = userTestProps.createTestUser();
    await repo.saveUser(user);
  });

  afterAll(async () => {
    await teardownMongoTestDB();
  });

  it('should save a user', async () => {
    const newUser = userTestProps.createTestUser({
      id: 'user-2',
      email: 'anotheruser@example.com',
    });
    await repo.saveUser(newUser);

    const allUsers = await repo.getAllUsers();
    expect(allUsers.length).toBe(2);
    expect(allUsers[1].email).toBe('anotheruser@example.com');
  });

  it('should update an existing user', async () => {
    const existingUser = await repo.getUserById(user.id);
    existingUser!.update({
      name: 'Updated Name',
    });
    await repo.saveUser(existingUser!);

    const allUsers = await repo.getAllUsers();
    expect(allUsers.length).toBe(1);
    expect(allUsers[0].name).toBe('Updated Name');
  });

  it('should retrieve a user by ID', async () => {
    const fetchedUser = await repo.getUserById(user.id);

    expect(fetchedUser).not.toBeNull();
    expect(fetchedUser!.id).toBe(user.id);
    expect(fetchedUser!.email).toBe(user.email);
  });

  it('should return null for non-existent user ID', async () => {
    const fetchedUser = await repo.getUserById('non-existent-id');

    expect(fetchedUser).toBeNull();
  });

  it('should retrieve a user by email', async () => {
    const fetchedUser = await repo.getUserByEmail(user.email);

    expect(fetchedUser).not.toBeNull();
    expect(fetchedUser!.id).toBe(user.id);
    expect(fetchedUser!.email).toBe(user.email);
  });

  it('should return null for non-existent email', async () => {
    const fetchedUser = await repo.getUserByEmail('nonexistent@example.com');

    expect(fetchedUser).toBeNull();
  });

  it('should retrieve a user by customer ID', async () => {
    const fetchedUser = await repo.getUserByCustomerId(user.customerId!);

    expect(fetchedUser).not.toBeNull();
    expect(fetchedUser!.id).toBe(user.id);
    expect(fetchedUser!.customerId).toBe(user.customerId);
  });

  it('should return null for non-existent customer ID', async () => {
    const fetchedUser = await repo.getUserByCustomerId('non-existent-customer');

    expect(fetchedUser).toBeNull();
  });

  it('should retrieve all users', async () => {
    const user2 = userTestProps.createTestUser({
      id: 'user-2',
      email: 'user2@example.com',
    });
    const user3 = userTestProps.createTestUser({
      id: 'user-3',
      email: 'user3@example.com',
    });

    await repo.saveUser(user2);
    await repo.saveUser(user3);

    const allUsers = await repo.getAllUsers();
    expect(allUsers).toHaveLength(3);
  });

  it('should delete a user by ID', async () => {
    const allUsers = await repo.getAllUsers();
    expect(allUsers.length).toBe(1);

    await repo.deleteUser(user.id);

    const allUsersAfterDeletion = await repo.getAllUsers();
    expect(allUsersAfterDeletion.length).toBe(0);
  });

  it('should reject when trying to delete a non-existent user', async () => {
    await expect(repo.deleteUser('non-existent-id')).rejects.toEqual(null);
  });
});
