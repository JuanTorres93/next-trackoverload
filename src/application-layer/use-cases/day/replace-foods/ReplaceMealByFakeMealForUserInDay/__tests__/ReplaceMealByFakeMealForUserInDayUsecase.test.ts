import * as dto from '@/../tests/dtoProperties';
import { NotFoundError } from '@/domain/common/errors';
import { Day } from '@/domain/entities/day/Day';
import { Meal } from '@/domain/entities/meal/Meal';
import { User } from '@/domain/entities/user/User';
import { MemoryDaysRepo } from '@/infra/repos/memory/MemoryDaysRepo';
import { MemoryFakeMealsRepo } from '@/infra/repos/memory/MemoryFakeMealsRepo';
import { MemoryMealsRepo } from '@/infra/repos/memory/MemoryMealsRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { Uuidv4IdGenerator } from '@/infra/services/IdGenerator/Uuidv4IdGenerator/Uuidv4IdGenerator';
import { MemoryTransactionContext } from '@/infra/transaction-context/MemoryTransactionContext/MemoryTransactionContext';
import * as dayTestProps from '@/../tests/createProps/dayTestProps';
import * as mealTestProps from '@/../tests/createProps/mealTestProps';
import * as userTestProps from '@/../tests/createProps/userTestProps';
import { beforeEach, describe, expect, it } from 'vitest';
import { ReplaceMealByFakeMealForUserInDayUsecase } from '../ReplaceMealByFakeMealForUserInDayUsecase';

describe('ReplaceMealByFakeMealForUserInDayUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let usersRepo: MemoryUsersRepo;
  let mealsRepo: MemoryMealsRepo;
  let fakeMealsRepo: MemoryFakeMealsRepo;
  let usecase: ReplaceMealByFakeMealForUserInDayUsecase;

  let user: User;
  let meal: Meal;
  let day: Day;

  const fakeMealData = {
    name: 'Fake Chicken',
    calories: 300,
    protein: 25,
  };

  beforeEach(async () => {
    daysRepo = new MemoryDaysRepo();
    usersRepo = new MemoryUsersRepo();
    mealsRepo = new MemoryMealsRepo();
    fakeMealsRepo = new MemoryFakeMealsRepo();

    usecase = new ReplaceMealByFakeMealForUserInDayUsecase(
      daysRepo,
      usersRepo,
      mealsRepo,
      fakeMealsRepo,
      new Uuidv4IdGenerator(),
      new MemoryTransactionContext(),
    );

    user = userTestProps.createTestUser();
    meal = mealTestProps.createTestMeal();
    day = dayTestProps.createEmptyTestDay();

    day.addMeal(meal.id);

    await usersRepo.saveUser(user);
    await mealsRepo.saveMeal(meal);
    await daysRepo.saveDay(day);
  });

  describe('Replacement', () => {
    it('should replace the old meal with a new fake meal in the day', async () => {
      const result = await usecase.execute({
        dayId: day.id,
        userId: userTestProps.userId,
        mealIdToReplace: meal.id,
        ...fakeMealData,
      });

      expect(result.mealIds).toHaveLength(0);
      expect(result.fakeMealIds).toHaveLength(1);
    });

    it('should return a DayDTO', async () => {
      const result = await usecase.execute({
        dayId: day.id,
        userId: userTestProps.userId,
        mealIdToReplace: meal.id,
        ...fakeMealData,
      });

      expect(result).not.toBeInstanceOf(Day);
      for (const prop of dto.dayDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });
  });

  describe('Side effects', () => {
    it('should delete the old meal from the repo', async () => {
      const mealsBefore = await mealsRepo.getAllMeals();
      expect(mealsBefore).toHaveLength(1);

      await usecase.execute({
        dayId: day.id,
        userId: userTestProps.userId,
        mealIdToReplace: meal.id,
        ...fakeMealData,
      });

      const mealsAfter = await mealsRepo.getAllMeals();
      expect(mealsAfter).toHaveLength(0);
    });

    it('should save the new fake meal to the repo', async () => {
      await usecase.execute({
        dayId: day.id,
        userId: userTestProps.userId,
        mealIdToReplace: meal.id,
        ...fakeMealData,
      });

      const fakeMealsAfter = await fakeMealsRepo.getAllFakeMeals();
      expect(fakeMealsAfter).toHaveLength(1);
      expect(fakeMealsAfter[0].name).toBe(fakeMealData.name);
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError if user does not exist', async () => {
      const request = {
        dayId: day.id,
        userId: 'non-existent-user',
        mealIdToReplace: meal.id,
        ...fakeMealData,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /ReplaceMealByFakeMeal.*User.*not found/,
      );
    });

    it('should throw NotFoundError if day does not exist', async () => {
      const request = {
        dayId: 'non-existent-day',
        userId: userTestProps.userId,
        mealIdToReplace: meal.id,
        ...fakeMealData,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /ReplaceMealByFakeMeal.*Day.*not found/,
      );
    });
  });
});
