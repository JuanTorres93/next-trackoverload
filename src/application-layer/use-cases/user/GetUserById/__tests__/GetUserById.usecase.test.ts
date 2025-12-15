import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { toUserDTO } from '@/application-layer/dtos/UserDTO';
import { User } from '@/domain/entities/user/User';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetUserByIdUsecase } from '../GetUserById.usecase';

describe('GetUserByIdUsecase', () => {
  let usersRepo: MemoryUsersRepo;
  let getUserByIdUsecase: GetUserByIdUsecase;

  beforeEach(() => {
    usersRepo = new MemoryUsersRepo();
    getUserByIdUsecase = new GetUserByIdUsecase(usersRepo);
  });

  describe('Execute', () => {
    it('should return user when found', async () => {
      const user = User.create({
        ...vp.validUserProps,
      });

      await usersRepo.saveUser(user);

      const result = await getUserByIdUsecase.execute({
        id: vp.validUserProps.id,
      });

      expect(result).toEqual(toUserDTO(user));
    });

    it('should return user DTO when found', async () => {
      const user = User.create({
        ...vp.validUserProps,
      });

      await usersRepo.saveUser(user);

      const result = await getUserByIdUsecase.execute({
        id: vp.validUserProps.id,
      });

      for (const prop of dto.userDTOProperties) {
        expect(result).not.toBeInstanceOf(User);
        expect(result).toHaveProperty(prop);
      }
    });

    it('should return null when user not found', async () => {
      const result = await getUserByIdUsecase.execute({ id: 'non-existent' });

      expect(result).toBeNull();
    });
  });
});
