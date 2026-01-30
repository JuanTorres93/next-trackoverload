import * as mealTestProps from '../../../../../../tests/createProps/mealTestProps';
import * as recipeTestProps from '../../../../../../tests/createProps/recipeTestProps';
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
import { RemoveIngredientFromMealUsecase } from '../RemoveIngredientFromMeal.usecase';

describe('RemoveIngredientFromMealUsecase', () => {
  let mealsRepo: MemoryMealsRepo;
  let usersRepo: MemoryUsersRepo;
  let removeIngredientFromMealUsecase: RemoveIngredientFromMealUsecase;
  let user: User;
  let testMeal: Meal;
  let testIngredient: Ingredient;
  let secondIngredient: Ingredient;

  beforeEach(async () => {
    mealsRepo = new MemoryMealsRepo();
    usersRepo = new MemoryUsersRepo();
    removeIngredientFromMealUsecase = new RemoveIngredientFromMealUsecase(
      mealsRepo,
      usersRepo,
    );

    user = User.create({
      ...userTestProps.validUserProps,
    });

    await usersRepo.saveUser(user);

    testIngredient = Ingredient.create({
      ...ingredientTestProps.validIngredientProps,
    });

    secondIngredient = Ingredient.create({
      ...ingredientTestProps.validIngredientProps,
      id: 'ing2',
    });

    const firstIngredientLine = IngredientLine.create({
      ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
      ingredient: testIngredient,
    });

    const secondIngredientLine = IngredientLine.create({
      ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
      ingredient: secondIngredient,
    });

    testMeal = Meal.create({
      ...mealTestProps.mealPropsNoIngredientLines,
      ingredientLines: [firstIngredientLine, secondIngredientLine],
    });
    await mealsRepo.saveMeal(testMeal);
  });

  describe('Removal', () => {
    it('should remove ingredient from meal successfully', async () => {
      const originalIngredientCount = testMeal.ingredientLines.length;

      const request = {
        userId: userTestProps.userId,
        mealId: testMeal.id,
        ingredientId: testIngredient.id,
      };

      const result = await removeIngredientFromMealUsecase.execute(request);

      expect(result.ingredientLines).toHaveLength(originalIngredientCount - 1);
      expect(
        result.ingredientLines.some(
          (line) => line.ingredient.id === testIngredient.id,
        ),
      ).toBe(false);
      expect(
        result.ingredientLines.some(
          (line) => line.ingredient.id === secondIngredient.id,
        ),
      ).toBe(true);
    });

    it('should return MealDTO', async () => {
      const request = {
        userId: userTestProps.userId,
        mealId: testMeal.id,
        ingredientId: testIngredient.id,
      };

      const result = await removeIngredientFromMealUsecase.execute(request);

      expect(result).not.toBeInstanceOf(Meal);

      for (const prop of dto.mealDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });

    it("should update meal's updatedAt timestamp", async () => {
      const originalUpdatedAt = testMeal.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 2));

      const request = {
        userId: userTestProps.userId,
        mealId: testMeal.id,
        ingredientId: testIngredient.id,
      };

      const result = await removeIngredientFromMealUsecase.execute(request);

      expect(new Date(result.updatedAt).getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime(),
      );
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError when meal does not exist', async () => {
      const request = {
        mealId: 'non-existent-id',
        ingredientId: testIngredient.id,
        userId: userTestProps.userId,
      };

      await expect(
        removeIngredientFromMealUsecase.execute(request),
      ).rejects.toThrow(NotFoundError);

      await expect(
        removeIngredientFromMealUsecase.execute(request),
      ).rejects.toThrow(/RemoveIngredientFromMealUsecase.*Meal.*not.*found/);
    });

    it('should throw error when trying to remove an ingredient from other users meal', async () => {
      const anotherUser = User.create({
        ...userTestProps.validUserProps,
        id: 'other-user-id',
      });
      await usersRepo.saveUser(anotherUser);

      const request = {
        userId: 'other-user-id',
        mealId: testMeal.id,
        ingredientId: testIngredient.id,
      };

      await expect(
        removeIngredientFromMealUsecase.execute(request),
      ).rejects.toThrow(NotFoundError);

      await expect(
        removeIngredientFromMealUsecase.execute(request),
      ).rejects.toThrow(/RemoveIngredientFromMealUsecase.*Meal.*not.*found/);
    });

    it('should throw error if user does not exist', async () => {
      const request = {
        userId: 'non-existent',
        mealId: 'some-id',
        ingredientId: 'some-ingredient-id',
      };

      await expect(
        removeIngredientFromMealUsecase.execute(request),
      ).rejects.toThrow(NotFoundError);

      await expect(
        removeIngredientFromMealUsecase.execute(request),
      ).rejects.toThrow(/RemoveIngredientFromMealUsecase.*user.*not.*found/);
    });
  });
});
