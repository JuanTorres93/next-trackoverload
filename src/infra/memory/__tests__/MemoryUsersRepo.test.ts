import { beforeEach, describe, expect, it } from 'vitest';
import { Id } from '@/domain/value-objects/Id/Id';
import { MemoryUsersRepo } from '../MemoryUsersRepo';
import { User } from '@/domain/entities/user/User';
import * as vp from '@/../tests/createProps';

const validUserProps = {
  ...vp.validUserProps,
  id: Id.create('1'),
  name: 'John Doe',
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
      id: Id.create('2'),
      name: 'Jane Doe',
      customerId: Id.create('customer-2'),
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
