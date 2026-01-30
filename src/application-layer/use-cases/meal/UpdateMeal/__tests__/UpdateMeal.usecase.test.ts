import * as vp from '@/../tests/createProps';
import * as ingredientTestProps from '../../../../../../tests/createProps/ingredientTestProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import * as dto from '@/../tests/dtoProperties';
import { NotFoundError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Meal } from '@/domain/entities/meal/Meal';
import { User } from '@/domain/entities/user/User';
import { MemoryMealsRepo } from '@/infra/repos/memory/MemoryMealsRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateMealUsecase } from '../UpdateMeal.usecase';

describe('UpdateMealUsecase', () => {
  let mealsRepo: MemoryMealsRepo;
  let usersRepo: MemoryUsersRepo;
  let updateMealUsecase: UpdateMealUsecase;
  let user: User;
  let meal: Meal;

  beforeEach(async () => {
    mealsRepo = new MemoryMealsRepo();
    usersRepo = new MemoryUsersRepo();
    updateMealUsecase = new UpdateMealUsecase(mealsRepo, usersRepo);

    user = User.create({
      ...userTestProps.validUserProps,
    });

    await usersRepo.saveUser(user);

    const ingredient = Ingredient.create({
      ...ingredientTestProps.validIngredientProps,
    });

    const ingredientLine = IngredientLine.create({
      ...vp.ingredientLineRecipePropsNoIngredient,
      ingredient,
    });

    meal = Meal.create({
      ...vp.mealPropsNoIngredientLines,
      ingredientLines: [ingredientLine],
    });

    await mealsRepo.saveMeal(meal);

    // Wait a bit to ensure updatedAt will be different
    await new Promise((resolve) => setTimeout(resolve, 2));
  });

  describe('Updated', () => {
    it('should update meal name', async () => {
      const updatedMeal = await updateMealUsecase.execute({
        id: meal.id,
        userId: userTestProps.userId,
        name: 'High Protein Meal',
      });

      expect(updatedMeal.name).toBe('High Protein Meal');
      expect(updatedMeal.id).toBe(vp.mealPropsNoIngredientLines.id);
      expect(updatedMeal.ingredientLines).toHaveLength(1);
      expect(updatedMeal.createdAt).toBe(meal.createdAt.toISOString());
      expect(updatedMeal.updatedAt).not.toBe(
        vp.mealPropsNoIngredientLines.updatedAt.toISOString(),
      );
    });

    it('should return MealDTO', async () => {
      const result = await updateMealUsecase.execute({
        id: meal.id,
        userId: userTestProps.userId,
        name: 'Updated Meal Name',
      });

      expect(result).not.toBeInstanceOf(Meal);

      for (const prop of dto.mealDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError when meal does not exist', async () => {
      const request = {
        id: 'non-existent-meal-id',
        userId: userTestProps.userId,
        name: 'New Name',
      };

      await expect(updateMealUsecase.execute(request)).rejects.toThrow(
        NotFoundError,
      );

      await expect(updateMealUsecase.execute(request)).rejects.toThrow(
        /UpdateMealUsecase.*Meal.*not.*found/,
      );
    });

    it('should throw error if user does not exist', async () => {
      const request = {
        id: meal.id,
        userId: 'non-existent',
        name: 'New Name',
      };

      await expect(updateMealUsecase.execute(request)).rejects.toThrow(
        NotFoundError,
      );
      await expect(updateMealUsecase.execute(request)).rejects.toThrow(
        /UpdateMealUsecase.*user.*not.*found/,
      );
    });

    it("should throw error when trying to read another user's meal", async () => {
      const anotherUser = User.create({
        ...userTestProps.validUserProps,
        id: 'another-user-id',
        email: 'anotheruser@example.com',
      });

      await usersRepo.saveUser(anotherUser);

      const request = {
        id: meal.id,
        userId: anotherUser.id,
        name: 'New Name',
      };

      await expect(updateMealUsecase.execute(request)).rejects.toThrow(
        NotFoundError,
      );
      await expect(updateMealUsecase.execute(request)).rejects.toThrow(
        /UpdateMealUsecase.*Meal.*not.*found/,
      );
    });
  });
});
