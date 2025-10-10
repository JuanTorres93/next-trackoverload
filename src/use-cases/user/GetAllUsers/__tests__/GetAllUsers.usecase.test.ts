import { beforeEach, describe, expect, it } from 'vitest';
import { GetAllUsersUsecase } from '../GetAllUsers.usecase';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { User } from '@/domain/entities/user/User';
import * as vp from '@/../tests/createProps';

describe('GetAllUsersUsecase', () => {
  let usersRepo: MemoryUsersRepo;
  let getAllUsersUsecase: GetAllUsersUsecase;

  beforeEach(() => {
    usersRepo = new MemoryUsersRepo();
    getAllUsersUsecase = new GetAllUsersUsecase(usersRepo);
  });

  it('should return all users', async () => {
    const user1 = User.create({
      ...vp.validUserProps,
      id: '1',
      name: 'User One',
    });

    const user2 = User.create({
      ...vp.validUserProps,
      id: '2',
      name: 'User Two',
    });

    await usersRepo.saveUser(user1);
    await usersRepo.saveUser(user2);

    const result = await getAllUsersUsecase.execute();

    expect(result).toHaveLength(2);
    expect(result).toContainEqual(user1);
    expect(result).toContainEqual(user2);
  });

  it('should return empty array when no users exist', async () => {
    const result = await getAllUsersUsecase.execute();

    expect(result).toEqual([]);
  });
});
