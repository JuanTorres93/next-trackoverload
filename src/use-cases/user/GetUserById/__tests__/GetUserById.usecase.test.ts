import { beforeEach, describe, expect, it } from 'vitest';
import { GetUserByIdUsecase } from '../GetUserById.usecase';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { User } from '@/domain/entities/user/User';
import { ValidationError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';

describe('GetUserByIdUsecase', () => {
  let usersRepo: MemoryUsersRepo;
  let getUserByIdUsecase: GetUserByIdUsecase;

  beforeEach(() => {
    usersRepo = new MemoryUsersRepo();
    getUserByIdUsecase = new GetUserByIdUsecase(usersRepo);
  });

  it('should return user when found', async () => {
    const user = User.create({
      ...vp.validUserProps,
      id: '1',
      name: 'John Doe',
    });

    await usersRepo.saveUser(user);

    const result = await getUserByIdUsecase.execute({ id: '1' });

    expect(result).toEqual(user);
  });

  it('should return null when user not found', async () => {
    const result = await getUserByIdUsecase.execute({ id: 'non-existent' });

    expect(result).toBeNull();
  });

  it('should throw error when id is invalid', async () => {
    const invalidIds = [true, 4, null, undefined, {}, [], '   ', '', NaN, -5];

    for (const invalidId of invalidIds) {
      await expect(
        // @ts-expect-error Testing invalid inputs
        getUserByIdUsecase.execute({ id: invalidId })
      ).rejects.toThrow(ValidationError);
    }
  });
});
