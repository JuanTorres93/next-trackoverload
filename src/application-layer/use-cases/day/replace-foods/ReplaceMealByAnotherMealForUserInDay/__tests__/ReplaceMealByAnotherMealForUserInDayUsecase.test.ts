import * as dto from '@/../tests/dtoProperties';
import { NotFoundError } from '@/domain/common/errors';
import { Day } from '@/domain/entities/day/Day';
import { Meal } from '@/domain/entities/meal/Meal';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { User } from '@/domain/entities/user/User';
import { MemoryDaysRepo } from '@/infra/repos/memory/MemoryDaysRepo';
import { MemoryMealsRepo } from '@/infra/repos/memory/MemoryMealsRepo';
import { MemoryRecipesRepo } from '@/infra/repos/memory/MemoryRecipesRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { Uuidv4IdGenerator } from '@/infra/services/IdGenerator/Uuidv4IdGenerator/Uuidv4IdGenerator';
import { MemoryTransactionContext } from '@/infra/transaction-context/MemoryTransactionContext/MemoryTransactionContext';
import * as dayTestProps from '@/../tests/createProps/dayTestProps';
import * as mealTestProps from '@/../tests/createProps/mealTestProps';
import * as recipeTestProps from '@/../tests/createProps/recipeTestProps';
import * as userTestProps from '@/../tests/createProps/userTestProps';
import { beforeEach, describe, expect, it } from 'vitest';
import { ReplaceMealByAnotherMealForUserInDayUsecase } from '../ReplaceMealByAnotherMealForUserInDayUsecase';

describe('ReplaceMealByAnotherMealForUserInDayUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let usersRepo: MemoryUsersRepo;
  let mealsRepo: MemoryMealsRepo;
  let recipesRepo: MemoryRecipesRepo;

  let usecase: ReplaceMealByAnotherMealForUserInDayUsecase;

  let user: User;
  let meal: Meal;
  let recipe: Recipe;
  let day: Day;

  beforeEach(async () => {
    daysRepo = new MemoryDaysRepo();
    usersRepo = new MemoryUsersRepo();
    mealsRepo = new MemoryMealsRepo();
    recipesRepo = new MemoryRecipesRepo();

    usecase = new ReplaceMealByAnotherMealForUserInDayUsecase(
      daysRepo,
      usersRepo,
      mealsRepo,
      recipesRepo,
      new Uuidv4IdGenerator(),
      new MemoryTransactionContext(),
    );

    user = userTestProps.createTestUser();
    meal = mealTestProps.createTestMeal();
    recipe = recipeTestProps.createTestRecipe();
    day = dayTestProps.createEmptyTestDay();

    day.addMeal(meal.id);

    await usersRepo.saveUser(user);
    await mealsRepo.saveMeal(meal);
    await recipesRepo.saveRecipe(recipe);
    await daysRepo.saveDay(day);
  });

  describe('Replacement', () => {
    it('should replace the old meal with a new one in the day', async () => {
      const result = await usecase.execute({
        dayId: day.id,
        userId: userTestProps.userId,
        mealToReplaceId: meal.id,
        recipeId: recipe.id,
      });

      expect(result.mealIds).toHaveLength(1);
      expect(result.mealIds).not.toContain(meal.id);
    });

    it('should return a DayDTO', async () => {
      const result = await usecase.execute({
        dayId: day.id,
        userId: userTestProps.userId,
        mealToReplaceId: meal.id,
        recipeId: recipe.id,
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
        mealToReplaceId: meal.id,
        recipeId: recipe.id,
      });

      const mealsAfter = await mealsRepo.getAllMeals();
      expect(mealsAfter).toHaveLength(1);
      expect(mealsAfter[0].id).not.toBe(meal.id);
    });

    it('should save the new meal to the repo', async () => {
      await usecase.execute({
        dayId: day.id,
        userId: userTestProps.userId,
        mealToReplaceId: meal.id,
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
        mealToReplaceId: meal.id,
        recipeId: recipe.id,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /ReplaceMealByAnotherMeal.*User.*not found/,
      );
    });

    it('should throw NotFoundError if recipe does not exist', async () => {
      const request = {
        dayId: day.id,
        userId: userTestProps.userId,
        mealToReplaceId: meal.id,
        recipeId: 'non-existent-recipe',
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /ReplaceMealByAnotherMeal.*Recipe.*not found/,
      );
    });

    it('should throw NotFoundError if day does not exist', async () => {
      const request = {
        dayId: 'non-existent-day',
        userId: userTestProps.userId,
        mealToReplaceId: meal.id,
        recipeId: recipe.id,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /ReplaceMealByAnotherMeal.*Day.*not found/,
      );
    });

    it("should throw NotFoundError when accessing another user's day", async () => {
      const anotherUser = userTestProps.createTestUser({
        id: 'another-user-id',
        email: 'another@example.com',
      });
      await usersRepo.saveUser(anotherUser);

      const request = {
        dayId: day.id,
        userId: anotherUser.id,
        mealToReplaceId: meal.id,
        recipeId: recipe.id,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /ReplaceMealByAnotherMeal.*Day.*not found/,
      );
    });
  });
});
