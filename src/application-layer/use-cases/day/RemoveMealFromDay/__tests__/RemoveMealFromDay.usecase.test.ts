import { NotFoundError } from '@/domain/common/errors';
import { Day } from '@/domain/entities/day/Day';
import { User } from '@/domain/entities/user/User';
import { MemoryDaysRepo } from '@/infra/repos/memory/MemoryDaysRepo';
import { MemoryMealsRepo } from '@/infra/repos/memory/MemoryMealsRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { RemoveMealFromDayUsecase } from '../RemoveMealFromDay.usecase';

import * as vp from '@/../tests/createProps';
import * as dayTestProps from '../../../../../../tests/createProps/dayTestProps';
import * as fakeMealTestProps from '../../../../../../tests/createProps/fakeMealTestProps';
import * as mealTestProps from '../../../../../../tests/createProps/mealTestProps';
import * as recipeTestProps from '../../../../../../tests/createProps/recipeTestProps';
import * as ingredientTestProps from '../../../../../../tests/createProps/ingredientTestProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import * as dto from '@/../tests/dtoProperties';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Meal } from '@/domain/entities/meal/Meal';

describe('RemoveMealFromDayUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let usersRepo: MemoryUsersRepo;
  let mealsRepo: MemoryMealsRepo;

  let removeMealFromDayUsecase: RemoveMealFromDayUsecase;
  let user: User;
  let meal: Meal;
  let day: Day;

  beforeEach(async () => {
    daysRepo = new MemoryDaysRepo();
    usersRepo = new MemoryUsersRepo();
    mealsRepo = new MemoryMealsRepo();
    removeMealFromDayUsecase = new RemoveMealFromDayUsecase(
      daysRepo,
      usersRepo,
      mealsRepo,
    );

    const ingredient = Ingredient.create(
      ingredientTestProps.validIngredientProps,
    );
    const ingredientLine = IngredientLine.create({
      ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
      ingredient,
      quantityInGrams: 150,
    });

    meal = Meal.create({
      ...mealTestProps.mealPropsNoIngredientLines,
      ingredientLines: [ingredientLine],
    });

    day = Day.create({
      ...dayTestProps.validDayProps(),
    });

    user = User.create({
      ...userTestProps.validUserProps,
    });

    day.addMeal(meal.id);

    await usersRepo.saveUser(user);
    await mealsRepo.saveMeal(meal);
    await daysRepo.saveDay(day);
  });

  describe('Removal', () => {
    it('should remove meal from day', async () => {
      const result = await removeMealFromDayUsecase.execute({
        date: day.id,
        userId: userTestProps.userId,
        mealId: mealTestProps.mealPropsNoIngredientLines.id,
      });

      expect(result.mealIds).toHaveLength(0);
    });

    it('should not affect fake meals', async () => {
      day.addFakeMeal('fakeMeal1');
      await daysRepo.saveDay(day);

      await removeMealFromDayUsecase.execute({
        date: day.id,
        userId: userTestProps.userId,
        mealId: mealTestProps.mealPropsNoIngredientLines.id,
      });

      const updatedDay = await daysRepo.getDayByIdAndUserId(
        day.id,
        userTestProps.userId,
      );
      expect(updatedDay!.fakeMealIds).toHaveLength(1);
      expect(updatedDay!.fakeMealIds[0]).toBe('fakeMeal1');
    });

    it('should return a DayDTO', async () => {
      const result = await removeMealFromDayUsecase.execute({
        date: day.id,
        userId: userTestProps.userId,
        mealId: mealTestProps.mealPropsNoIngredientLines.id,
      });

      expect(result).not.toBeInstanceOf(Day);
      for (const prop of dto.dayDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });
  });

  describe('Side effects', () => {
    it('should remove meal from repo', async () => {
      const initialMeals = await mealsRepo.getAllMeals();
      expect(initialMeals).toHaveLength(1);

      await removeMealFromDayUsecase.execute({
        date: day.id,
        userId: userTestProps.userId,
        mealId: mealTestProps.mealPropsNoIngredientLines.id,
      });

      const mealsAfterRemoval = await mealsRepo.getAllMeals();
      expect(mealsAfterRemoval).toHaveLength(0);
    });
  });

  describe('Errors', () => {
    it('should throw error if day does not exist', async () => {
      const request = {
        date: '11111001',
        userId: userTestProps.userId,
        mealId: fakeMealTestProps.validFakeMealProps.id,
      };

      await expect(removeMealFromDayUsecase.execute(request)).rejects.toThrow(
        NotFoundError,
      );
      await expect(removeMealFromDayUsecase.execute(request)).rejects.toThrow(
        /RemoveMealFromDay.*Day.*not/,
      );
    });

    it('should throw error if user does not exist', async () => {
      const request = {
        date: day.id,
        userId: 'non-existent',
        mealId: fakeMealTestProps.validFakeMealProps.id,
      };

      await expect(removeMealFromDayUsecase.execute(request)).rejects.toThrow(
        NotFoundError,
      );

      await expect(removeMealFromDayUsecase.execute(request)).rejects.toThrow(
        /RemoveMealFromDay.*User.*not.*found/,
      );
    });

    it("should throw error when trying to remove meal another user's day", async () => {
      const anotherUser = User.create({
        ...userTestProps.validUserProps,
        id: 'another-user-id',
        email: 'another-user@example.com',
      });
      await usersRepo.saveUser(anotherUser);

      const request = {
        date: day.id,
        userId: anotherUser.id,
        mealId: mealTestProps.mealPropsNoIngredientLines.id,
      };

      await expect(removeMealFromDayUsecase.execute(request)).rejects.toThrow(
        NotFoundError,
      );

      await expect(removeMealFromDayUsecase.execute(request)).rejects.toThrow(
        /RemoveMealFromDay.*Day.*not/,
      );
    });
  });
});
