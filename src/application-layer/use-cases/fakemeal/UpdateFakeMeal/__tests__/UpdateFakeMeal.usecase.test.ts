import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { User } from '@/domain/entities/user/User';
import { NotFoundError } from '@/domain/common/errors';
import { MemoryFakeMealsRepo } from '@/infra/memory/MemoryFakeMealsRepo';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateFakeMealUsecase } from '../UpdateFakeMeal.usecase';

describe('UpdateFakeMealUsecase', () => {
  let usecase: UpdateFakeMealUsecase;
  let fakeMealsRepo: MemoryFakeMealsRepo;
  let usersRepo: MemoryUsersRepo;
  let user: User;

  beforeEach(async () => {
    fakeMealsRepo = new MemoryFakeMealsRepo();
    usersRepo = new MemoryUsersRepo();
    usecase = new UpdateFakeMealUsecase(fakeMealsRepo, usersRepo);

    user = User.create({
      ...vp.validUserProps,
    });

    await usersRepo.saveUser(user);
  });

  describe('Updated', () => {
    it('should update fake meal name successfully', async () => {
      const fakeMeal = FakeMeal.create({
        ...vp.validFakeMealProps,
        name: 'Original Name',
      });

      await fakeMealsRepo.saveFakeMeal(fakeMeal);

      const result = await usecase.execute({
        id: vp.validFakeMealProps.id,
        userId: vp.userId,
        patch: { name: 'Updated Name' },
      });

      expect(result.name).toBe('Updated Name');
      expect(result.calories).toBe(200);
      expect(result.protein).toBe(30);
    });

    it('should return FakeMealDTO', async () => {
      const fakeMeal = FakeMeal.create({
        ...vp.validFakeMealProps,
        name: 'Original Name',
      });

      await fakeMealsRepo.saveFakeMeal(fakeMeal);

      const result = await usecase.execute({
        id: vp.validFakeMealProps.id,
        userId: vp.userId,
        patch: { name: 'Updated Name' },
      });

      expect(result).not.toBeInstanceOf(FakeMeal);
      for (const prop of dto.fakeMealDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });

    it('should update fake meal only calories successfully', async () => {
      const fakeMeal = FakeMeal.create({
        ...vp.validFakeMealProps,
        name: 'Test Meal',
      });

      await fakeMealsRepo.saveFakeMeal(fakeMeal);

      const result = await usecase.execute({
        id: vp.validFakeMealProps.id,
        userId: vp.userId,
        patch: { calories: 600 },
      });

      expect(result.name).toBe('Test Meal');
      expect(result.calories).toBe(600);
      expect(result.protein).toBe(30);
    });

    it('should update fake meal only protein successfully', async () => {
      const fakeMeal = FakeMeal.create({
        ...vp.validFakeMealProps,
        name: 'Test Meal',
      });

      await fakeMealsRepo.saveFakeMeal(fakeMeal);

      const result = await usecase.execute({
        id: vp.validFakeMealProps.id,
        userId: vp.userId,
        patch: { protein: 40 },
      });

      expect(result.name).toBe('Test Meal');
      expect(result.calories).toBe(200);
      expect(result.protein).toBe(40);
    });

    it('should update multiple fields at once', async () => {
      const fakeMeal = FakeMeal.create({
        ...vp.validFakeMealProps,
        name: 'Original Name',
      });

      await fakeMealsRepo.saveFakeMeal(fakeMeal);

      const result = await usecase.execute({
        id: vp.validFakeMealProps.id,
        userId: vp.userId,
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
      const fakeMeal = FakeMeal.create({
        ...vp.validFakeMealProps,
      });

      await fakeMealsRepo.saveFakeMeal(fakeMeal);

      await expect(
        usecase.execute({
          id: vp.validFakeMealProps.id,
          userId: 'non-existent',
          patch: { name: 'Updated Name' },
        })
      ).rejects.toThrow(NotFoundError);
      await expect(
        usecase.execute({
          id: vp.validFakeMealProps.id,
          userId: 'non-existent',
          patch: { name: 'Updated Name' },
        })
      ).rejects.toThrow(/UpdateFakeMealUsecase.*user.*not.*found/);
    });

    it('should throw error if fakeMeal does not exist', async () => {
      await expect(
        usecase.execute({
          id: 'non-existent',
          userId: vp.userId,
          patch: { name: 'Updated Name' },
        })
      ).rejects.toThrow(NotFoundError);
      await expect(
        usecase.execute({
          id: 'non-existent',
          userId: vp.userId,
          patch: { name: 'Updated Name' },
        })
      ).rejects.toThrow(/UpdateFakeMealUsecase.*FakeMeal.*not found/);
    });
  });
});
