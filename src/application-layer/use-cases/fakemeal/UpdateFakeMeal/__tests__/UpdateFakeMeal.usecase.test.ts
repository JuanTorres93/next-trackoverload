import * as fakeMealTestProps from '../../../../../../tests/createProps/fakeMealTestProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import * as dto from '@/../tests/dtoProperties';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { User } from '@/domain/entities/user/User';
import { NotFoundError } from '@/domain/common/errors';
import { MemoryFakeMealsRepo } from '@/infra/repos/memory/MemoryFakeMealsRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateFakeMealUsecase } from '../UpdateFakeMeal.usecase';

describe('UpdateFakeMealUsecase', () => {
  let usecase: UpdateFakeMealUsecase;
  let fakeMealsRepo: MemoryFakeMealsRepo;
  let usersRepo: MemoryUsersRepo;
  let user: User;
  let fakeMeal: FakeMeal;

  beforeEach(async () => {
    fakeMealsRepo = new MemoryFakeMealsRepo();
    usersRepo = new MemoryUsersRepo();
    usecase = new UpdateFakeMealUsecase(fakeMealsRepo, usersRepo);

    user = User.create({
      ...userTestProps.validUserProps,
    });

    fakeMeal = FakeMeal.create({
      ...fakeMealTestProps.validFakeMealProps,
    });

    await usersRepo.saveUser(user);
    await fakeMealsRepo.saveFakeMeal(fakeMeal);
  });

  describe('Updated', () => {
    it('should update fake meal name successfully', async () => {
      const result = await usecase.execute({
        id: fakeMealTestProps.validFakeMealProps.id,
        userId: userTestProps.userId,
        patch: { name: 'Updated Name' },
      });

      expect(result.name).toBe('Updated Name');
      expect(result.calories).toBe(200);
      expect(result.protein).toBe(30);
    });

    it('should return FakeMealDTO', async () => {
      const result = await usecase.execute({
        id: fakeMealTestProps.validFakeMealProps.id,
        userId: userTestProps.userId,
        patch: { name: 'Updated Name' },
      });

      expect(result).not.toBeInstanceOf(FakeMeal);
      for (const prop of dto.fakeMealDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });

    it('should update fake meal only calories successfully', async () => {
      const result = await usecase.execute({
        id: fakeMealTestProps.validFakeMealProps.id,
        userId: userTestProps.userId,
        patch: { calories: 600 },
      });

      expect(result.name).toBe(fakeMealTestProps.validFakeMealProps.name);
      expect(result.calories).toBe(600);
      expect(result.protein).toBe(30);
    });

    it('should update fake meal only protein successfully', async () => {
      const result = await usecase.execute({
        id: fakeMealTestProps.validFakeMealProps.id,
        userId: userTestProps.userId,
        patch: { protein: 40 },
      });

      expect(result.name).toBe(fakeMealTestProps.validFakeMealProps.name);
      expect(result.calories).toBe(200);
      expect(result.protein).toBe(40);
    });

    it('should update multiple fields at once', async () => {
      const result = await usecase.execute({
        id: fakeMealTestProps.validFakeMealProps.id,
        userId: userTestProps.userId,
        patch: {
          name: 'Updated Name',
          calories: 600,
          protein: 40,
        },
      });

      expect(result.name).toBe('Updated Name');
      expect(result.calories).toBe(600);
      expect(result.protein).toBe(40);
    });
  });

  describe('Errors', () => {
    it('should throw error if user does not exist', async () => {
      const request = {
        id: fakeMealTestProps.validFakeMealProps.id,
        userId: 'non-existent',
        patch: { name: 'Updated Name' },
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /UpdateFakeMealUsecase.*user.*not.*found/,
      );
    });

    it('should throw error if fakeMeal does not exist', async () => {
      const request = {
        id: 'non-existent',
        userId: userTestProps.userId,
        patch: { name: 'Updated Name' },
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /UpdateFakeMealUsecase.*FakeMeal.*not found/,
      );
    });

    it("should throw error when trying to update another user's fake meal", async () => {
      const anotherUser = User.create({
        ...userTestProps.validUserProps,
        id: 'another-user-id',
        email: 'anotheruser@example.com',
      });
      await usersRepo.saveUser(anotherUser);

      const request = {
        id: fakeMealTestProps.validFakeMealProps.id,
        userId: anotherUser.id,
        patch: { name: 'Updated Name' },
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /UpdateFakeMealUsecase.*FakeMeal.*not.*found/,
      );
    });
  });
});
