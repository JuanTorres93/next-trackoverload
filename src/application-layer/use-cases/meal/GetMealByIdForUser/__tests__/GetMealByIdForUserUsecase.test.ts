import { NotFoundError } from '@/domain/common/errors';
import { GetMealByIdForUserUsecase } from '../GetMealByIdForUserUsecase';
import { Meal } from '@/domain/entities/meal/Meal';

import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { MemoryMealsRepo } from '@/infra/repos/memory/MemoryMealsRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { User } from '@/domain/entities/user/User';

describe('GetMealByIdForUserUsecase', () => {
  let mealsRepo: MemoryMealsRepo;
  let usersRepo: MemoryUsersRepo;
  let usecase: GetMealByIdForUserUsecase;
  let meal: Meal;
  let user: User;

  beforeEach(async () => {
    mealsRepo = new MemoryMealsRepo();
    usersRepo = new MemoryUsersRepo();
    usecase = new GetMealByIdForUserUsecase(mealsRepo, usersRepo);

    user = User.create({ ...vp.validUserProps });
    await usersRepo.saveUser(user);

    meal = Meal.create({
      ...vp.validMealWithIngredientLines(),
    });

    await mealsRepo.saveMeal(meal);
  });

  describe('Execution', () => {
    it('should return MealDTO', async () => {
      const result = await usecase.execute({
        mealId: meal.id,
        userId: vp.userId,
      });

      expect(result).not.toBeInstanceOf(Meal);
      for (const prop of dto.mealDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });

    it('should return null if meal not found', async () => {
      const result = await usecase.execute({
        mealId: 'non-existent-meal-id',
        userId: vp.userId,
      });

      expect(result).toBeNull();
    });

    it('should return null if meal does not belong to user', async () => {
      const anotherUser = User.create({
        ...vp.validUserProps,
        id: 'another-user-id',
      });
      await usersRepo.saveUser(anotherUser);

      const result = await usecase.execute({
        mealId: meal.id,
        userId: anotherUser.id,
      });

      expect(result).toBeNull();
    });
  });

  describe('Errors', () => {
    it('should throw error if user does not exist', async () => {
      const request = {
        mealId: meal.id,
        userId: 'non-existent-user-id',
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);

      await expect(usecase.execute(request)).rejects.toThrow(
        /GetMealByIdForUserUsecase.*User.*not found/
      );
    });
  });
});
