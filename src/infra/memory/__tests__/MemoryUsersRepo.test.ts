import * as vp from '@/../tests/createProps';
import { User } from '@/domain/entities/user/User';
import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryUsersRepo } from '../MemoryUsersRepo';

const validUserProps = {
  ...vp.validUserProps,
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
      ...vp.validUserProps,
      id: 'another-user-id',
      name: 'Jane Doe',
      customerId: 'another-customer-id',
    });
    await repo.saveUser(newUser);

    const allUsers = await repo.getAllUsers();
    expect(allUsers.length).toBe(2);
    expect(allUsers[0].name).toBe(vp.validUserProps.name);
    expect(allUsers[1].name).toBe('Jane Doe');
  });

  it('should retrieve a user by ID', async () => {
    const fetchedUser = await repo.getUserById(vp.validUserProps.id);
    expect(fetchedUser).not.toBeNull();
    expect(fetchedUser?.name).toBe(vp.validUserProps.name);
  });

  it('should retrieve a user by email', async () => {
    const fetchedUser = await repo.getUserByEmail(vp.validUserProps.email);
    expect(fetchedUser).not.toBeNull();
    expect(fetchedUser?.email).toBe(vp.validUserProps.email);
    expect(fetchedUser?.name).toBe(vp.validUserProps.name);
  });

  it('should return null for non-existent email', async () => {
    const fetchedUser = await repo.getUserByEmail('non-existent@example.com');
    expect(fetchedUser).toBeNull();
  });

  it('should return null for non-existent user ID', async () => {
    const fetchedUser = await repo.getUserById('non-existent-id');
    expect(fetchedUser).toBeNull();
  });

  it('should delete a user by ID', async () => {
    const allUsers = await repo.getAllUsers();
    expect(allUsers.length).toBe(1);

    await repo.deleteUser(vp.validUserProps.id);
    const allUsersAfterDeletion = await repo.getAllUsers();
    expect(allUsersAfterDeletion.length).toBe(0);
  });
});
