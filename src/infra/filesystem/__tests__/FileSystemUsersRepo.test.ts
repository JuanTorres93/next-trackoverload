import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import { FileSystemUsersRepo } from '../FileSystemUsersRepo';
import { User } from '@/domain/entities/user/User';
import * as vp from '@/../tests/createProps';
import fs from 'fs/promises';
import path from 'path';

describe('FileSystemUsersRepo', () => {
  let repo: FileSystemUsersRepo;
  let user: User;
  const testDir = './__test_data__/users';

  beforeEach(async () => {
    repo = new FileSystemUsersRepo(testDir);
    user = User.create(vp.validUserProps);
    await repo.saveUser(user);
  });

  afterEach(async () => {
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch {
      // Directory might not exist
    }
  });

  it('should save a user', async () => {
    const newUser = User.create({
      ...vp.validUserProps,
      id: 'user-2',
      name: 'Jane Doe',
    });
    await repo.saveUser(newUser);

    const allUsers = await repo.getAllUsers();
    expect(allUsers.length).toBe(2);

    const savedUser = allUsers.find((u) => u.id === 'user-2');
    expect(savedUser).toBeDefined();
    expect(savedUser?.name).toBe('Jane Doe');
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

  it('should update an existing user', async () => {
    const updatedUser = User.create({
      ...vp.validUserProps,
      name: 'Updated Name',
      updatedAt: new Date('2023-01-03'),
    });
    await repo.saveUser(updatedUser);

    const fetchedUser = await repo.getUserById(vp.validUserProps.id);
    expect(fetchedUser).not.toBeNull();
    expect(fetchedUser?.name).toBe('Updated Name');
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

  it('should persist data to filesystem', async () => {
    const filePath = path.join(testDir, `${user.id}.json`);
    const fileExists = await fs
      .access(filePath)
      .then(() => true)
      .catch(() => false);
    expect(fileExists).toBe(true);

    const content = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(content);
    expect(data.id).toBe(user.id);
    expect(data.name).toBe(user.name);
  });
});
