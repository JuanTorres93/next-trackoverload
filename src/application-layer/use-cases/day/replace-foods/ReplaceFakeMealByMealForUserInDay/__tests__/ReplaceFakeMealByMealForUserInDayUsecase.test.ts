import * as dto from '@/../tests/dtoProperties';
import { NotFoundError } from '@/domain/common/errors';
import { Day } from '@/domain/entities/day/Day';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { User } from '@/domain/entities/user/User';
import { MemoryDaysRepo } from '@/infra/repos/memory/MemoryDaysRepo';
import { MemoryFakeMealsRepo } from '@/infra/repos/memory/MemoryFakeMealsRepo';
import { MemoryMealsRepo } from '@/infra/repos/memory/MemoryMealsRepo';
import { MemoryRecipesRepo } from '@/infra/repos/memory/MemoryRecipesRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { Uuidv4IdGenerator } from '@/infra/services/IdGenerator/Uuidv4IdGenerator/Uuidv4IdGenerator';
import { MemoryTransactionContext } from '@/infra/transaction-context/MemoryTransactionContext/MemoryTransactionContext';
import * as dayTestProps from '@/../tests/createProps/dayTestProps';
import * as fakeMealTestProps from '@/../tests/createProps/fakeMealTestProps';
import * as recipeTestProps from '@/../tests/createProps/recipeTestProps';
import * as userTestProps from '@/../tests/createProps/userTestProps';
import { beforeEach, describe, expect, it } from 'vitest';
import { ReplaceFakeMealByMealForUserInDayUsecase } from '../ReplaceFakeMealByMealForUserInDayUsecase';

describe('ReplaceFakeMealByMealForUserInDayUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let usersRepo: MemoryUsersRepo;
  let mealsRepo: MemoryMealsRepo;
  let fakeMealsRepo: MemoryFakeMealsRepo;
  let recipesRepo: MemoryRecipesRepo;
  let usecase: ReplaceFakeMealByMealForUserInDayUsecase;

  let user: User;
  let fakeMeal: FakeMeal;
  let recipe: Recipe;
  let day: Day;

  beforeEach(async () => {
    daysRepo = new MemoryDaysRepo();
    usersRepo = new MemoryUsersRepo();
    mealsRepo = new MemoryMealsRepo();
    fakeMealsRepo = new MemoryFakeMealsRepo();
    recipesRepo = new MemoryRecipesRepo();

    usecase = new ReplaceFakeMealByMealForUserInDayUsecase(
      daysRepo,
      usersRepo,
      mealsRepo,
      fakeMealsRepo,
      recipesRepo,
      new Uuidv4IdGenerator(),
      new MemoryTransactionContext(),
    );

    user = userTestProps.createTestUser();
    fakeMeal = fakeMealTestProps.createTestFakeMeal();
    recipe = recipeTestProps.createTestRecipe();
    day = dayTestProps.createEmptyTestDay();

    day.addFakeMeal(fakeMeal.id);

    await usersRepo.saveUser(user);
    await fakeMealsRepo.saveFakeMeal(fakeMeal);
    await recipesRepo.saveRecipe(recipe);
    await daysRepo.saveDay(day);
  });

  describe('Replacement', () => {
    it('should replace the old fake meal with a new meal in the day', async () => {
      const result = await usecase.execute({
        dayId: day.id,
        userId: userTestProps.userId,
        fakeMealIdToReplace: fakeMeal.id,
        recipeId: recipe.id,
      });

      expect(result.fakeMealIds).toHaveLength(0);
      expect(result.mealIds).toHaveLength(1);
    });

    it('should return a DayDTO', async () => {
      const result = await usecase.execute({
        dayId: day.id,
        userId: userTestProps.userId,
        fakeMealIdToReplace: fakeMeal.id,
        recipeId: recipe.id,
      });

      expect(result).not.toBeInstanceOf(Day);
      for (const prop of dto.dayDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });
  });

  describe('Side effects', () => {
    it('should delete the old fake meal from the repo', async () => {
      const fakeMealsBefore = await fakeMealsRepo.getAllFakeMeals();
      expect(fakeMealsBefore).toHaveLength(1);

      await usecase.execute({
        dayId: day.id,
        userId: userTestProps.userId,
        fakeMealIdToReplace: fakeMeal.id,
        recipeId: recipe.id,
      });

      const fakeMealsAfter = await fakeMealsRepo.getAllFakeMeals();
      expect(fakeMealsAfter).toHaveLength(0);
    });

    it('should save the new meal to the repo', async () => {
      await usecase.execute({
        dayId: day.id,
        userId: userTestProps.userId,
        fakeMealIdToReplace: fakeMeal.id,
        recipeId: recipe.id,
      });

      const mealsAfter = await mealsRepo.getAllMeals();
      expect(mealsAfter).toHaveLength(1);
      expect(mealsAfter[0].createdFromRecipeId).toBe(recipe.id);
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError if user does not exist', async () => {
      const request = {
        dayId: day.id,
        userId: 'non-existent-user',
        fakeMealIdToReplace: fakeMeal.id,
        recipeId: recipe.id,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /ReplaceFakeMealByMeal.*User.*not found/,
      );
    });

    it('should throw NotFoundError if recipe does not exist', async () => {
      const request = {
        dayId: day.id,
        userId: userTestProps.userId,
        fakeMealIdToReplace: fakeMeal.id,
        recipeId: 'non-existent-recipe',
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /ReplaceFakeMealByMeal.*Recipe.*not found/,
      );
    });

    it('should throw NotFoundError if day does not exist', async () => {
      const request = {
        dayId: 'non-existent-day',
        userId: userTestProps.userId,
        fakeMealIdToReplace: fakeMeal.id,
        recipeId: recipe.id,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /ReplaceFakeMealByMeal.*Day.*not found/,
      );
    });
  });
});
