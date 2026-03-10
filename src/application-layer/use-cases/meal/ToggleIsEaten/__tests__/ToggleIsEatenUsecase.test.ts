import * as dto from '@/../tests/dtoProperties';
import { NotFoundError } from '@/domain/common/errors';
import { Meal } from '@/domain/entities/meal/Meal';
import { User } from '@/domain/entities/user/User';
import { MemoryMealsRepo } from '@/infra/repos/memory/MemoryMealsRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import * as mealTestProps from '../../../../../../tests/createProps/mealTestProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import { ToggleIsEatenUsecase } from '../ToggleIsEatenUsecase';

describe('ToggleIsEatenUsecase', () => {
  let mealsRepo: MemoryMealsRepo;
  let usersRepo: MemoryUsersRepo;
  let usecase: ToggleIsEatenUsecase;
  let user: User;
  let meal: Meal;

  beforeEach(async () => {
    mealsRepo = new MemoryMealsRepo();
    usersRepo = new MemoryUsersRepo();
    usecase = new ToggleIsEatenUsecase(mealsRepo, usersRepo);

    user = userTestProps.createTestUser();
    meal = mealTestProps.createTestMeal();

    await usersRepo.saveUser(user);
    await mealsRepo.saveMeal(meal);
  });

  describe('Toggle', () => {
    it('should toggle isEaten from undefined to true', async () => {
      const result = await usecase.execute({
        mealId: meal.id,
        userId: userTestProps.userId,
      });

      expect(result.isEaten).toBe(true);
    });

    it('should toggle isEaten back to false on second call', async () => {
      await usecase.execute({ mealId: meal.id, userId: userTestProps.userId });

      const result = await usecase.execute({
        mealId: meal.id,
        userId: userTestProps.userId,
      });

      expect(result.isEaten).toBe(false);
    });

    it('should return MealDTO', async () => {
      const result = await usecase.execute({
        mealId: meal.id,
        userId: userTestProps.userId,
      });

      expect(result).not.toBeInstanceOf(Meal);
      for (const prop of dto.mealDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError when user does not exist', async () => {
      const request = { mealId: meal.id, userId: 'non-existent' };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /ToggleIsEatenUsecase.*User.*not.*found/,
      );
    });

    it('should throw NotFoundError when meal does not exist', async () => {
      const request = {
        mealId: 'non-existent-meal-id',
        userId: userTestProps.userId,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /ToggleIsEatenUsecase.*Meal.*not.*found/,
      );
    });

    it("should throw NotFoundError when toggling another user's meal", async () => {
      const anotherUser = userTestProps.createTestUser({
        id: 'another-user-id',
        email: 'anotheruser@example.com',
      });
      await usersRepo.saveUser(anotherUser);

      const request = { mealId: meal.id, userId: anotherUser.id };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /ToggleIsEatenUsecase.*Meal.*not.*found/,
      );
    });
  });
});
