import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { AuthError, NotFoundError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Meal } from '@/domain/entities/meal/Meal';
import { User } from '@/domain/entities/user/User';
import { MemoryIngredientsRepo } from '@/infra/memory/MemoryIngredientsRepo';
import { MemoryMealsRepo } from '@/infra/memory/MemoryMealsRepo';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  AddIngredientToMealUsecase,
  AddIngredientToMealUsecaseRequest,
} from '../AddIngredientToMeal.usecase';

describe('AddIngredientToMealUsecase', () => {
  let mealsRepo: MemoryMealsRepo;
  let ingredientsRepo: MemoryIngredientsRepo;
  let usersRepo: MemoryUsersRepo;
  let addIngredientToMealUsecase: AddIngredientToMealUsecase;
  let user: User;
  let testMeal: Meal;
  let newIngredientLineInfo: Omit<
    AddIngredientToMealUsecaseRequest,
    'mealId' | 'userId'
  >;

  beforeEach(async () => {
    mealsRepo = new MemoryMealsRepo();
    ingredientsRepo = new MemoryIngredientsRepo();
    usersRepo = new MemoryUsersRepo();
    addIngredientToMealUsecase = new AddIngredientToMealUsecase(
      mealsRepo,
      ingredientsRepo,
      usersRepo
    );

    user = User.create({
      ...vp.validUserProps,
    });

    await usersRepo.saveUser(user);

    const testIngredient = Ingredient.create({
      ...vp.validIngredientProps,
      name: 'Chicken Breast',
      calories: 165,
      protein: 31,
    });

    const testIngredientLine = IngredientLine.create({
      ...vp.ingredientLineRecipePropsNoIngredient,
      ingredient: testIngredient,
      quantityInGrams: 200,
    });

    testMeal = Meal.create({
      ...vp.mealPropsNoIngredientLines,
      ingredientLines: [testIngredientLine],
    });

    const newIngredient = Ingredient.create({
      ...vp.validIngredientProps,
      name: 'Rice',
      calories: 130,
      protein: 2.7,
    });

    await ingredientsRepo.saveIngredient(newIngredient);

    newIngredientLineInfo = {
      ingredientId: newIngredient.id,
      quantityInGrams: 150,
    };
  });

  describe('Addition', () => {
    it('should add ingredient to meal successfully', async () => {
      await mealsRepo.saveMeal(testMeal);
      const originalIngredientCount = testMeal.ingredientLines.length;

      const request = {
        mealId: testMeal.id,
        userId: vp.userId,
        ...newIngredientLineInfo,
      };

      const result = await addIngredientToMealUsecase.execute(request);

      expect(result.ingredientLines).toHaveLength(originalIngredientCount + 1);

      const ingredientIds = result.ingredientLines.map(
        (line) => line.ingredient.id
      );
      expect(ingredientIds).toContain(newIngredientLineInfo.ingredientId);
    });

    it('should save updated meal in repo', async () => {
      await mealsRepo.saveMeal(testMeal);
      const originalIngredientCount = testMeal.ingredientLines.length;

      const request = {
        mealId: testMeal.id,
        userId: vp.userId,
        ...newIngredientLineInfo,
      };

      await addIngredientToMealUsecase.execute(request);

      const savedMeal = await mealsRepo.getMealById(testMeal.id);
      expect(savedMeal).toBeDefined();
      expect(savedMeal!.ingredientLines).toHaveLength(
        originalIngredientCount + 1
      );
    });

    it('should return MealDTO', async () => {
      await mealsRepo.saveMeal(testMeal);

      const request = {
        mealId: testMeal.id,
        userId: vp.userId,
        ...newIngredientLineInfo,
      };

      const result = await addIngredientToMealUsecase.execute(request);

      expect(result).not.toBeInstanceOf(Meal);

      for (const prop of dto.mealDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });

    it("should update meal's updatedAt timestamp", async () => {
      await mealsRepo.saveMeal(testMeal);
      const originalUpdatedAt = testMeal.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 2));

      const request = {
        userId: vp.userId,
        mealId: testMeal.id,
        ...newIngredientLineInfo,
      };

      const result = await addIngredientToMealUsecase.execute(request);

      expect(new Date(result.updatedAt).getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime()
      );
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError when meal does not exist', async () => {
      const request = {
        mealId: 'non-existent-id',
        userId: vp.userId,
        ...newIngredientLineInfo,
      };

      await expect(addIngredientToMealUsecase.execute(request)).rejects.toThrow(
        NotFoundError
      );

      await expect(addIngredientToMealUsecase.execute(request)).rejects.toThrow(
        /AddIngredientToMealUsecase.*Meal.*not.*found/
      );
    });

    it("should not add ingredient to another user's meal", async () => {
      const anotherUser = User.create({
        ...vp.validUserProps,
        id: 'another-user-id',
      });
      await usersRepo.saveUser(anotherUser);
      await mealsRepo.saveMeal(testMeal);

      const request = {
        userId: 'another-user-id',
        mealId: testMeal.id,
        ...newIngredientLineInfo,
      };

      await expect(addIngredientToMealUsecase.execute(request)).rejects.toThrow(
        AuthError
      );

      await expect(addIngredientToMealUsecase.execute(request)).rejects.toThrow(
        /AddIngredientToMealUsecase.*not.*authorized/
      );
    });

    it('should throw error if user does not exist', async () => {
      await expect(
        addIngredientToMealUsecase.execute({
          userId: 'non-existent',
          mealId: 'some-id',
          ingredientId: 'some-ingredient-id',
          quantityInGrams: 100,
        })
      ).rejects.toThrow(NotFoundError);
      await expect(
        addIngredientToMealUsecase.execute({
          userId: 'non-existent',
          mealId: 'some-id',
          ingredientId: 'some-ingredient-id',
          quantityInGrams: 100,
        })
      ).rejects.toThrow(/AddIngredientToMealUsecase.*user.*not.*found/);
    });

    it('should throw NotFoundError when ingredient does not exist', async () => {
      await mealsRepo.saveMeal(testMeal);

      const request = {
        mealId: testMeal.id,
        userId: vp.userId,
        ingredientId: 'non-existent-ingredient-id',
        quantityInGrams: 100,
      };

      await expect(addIngredientToMealUsecase.execute(request)).rejects.toThrow(
        NotFoundError
      );

      await expect(addIngredientToMealUsecase.execute(request)).rejects.toThrow(
        /AddIngredientToMealUsecase.*Ingredient.*not.*found/
      );
    });
  });
});
