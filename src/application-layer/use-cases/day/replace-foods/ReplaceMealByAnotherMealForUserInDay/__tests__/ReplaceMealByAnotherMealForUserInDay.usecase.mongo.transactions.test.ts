import { Day } from '@/domain/entities/day/Day';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { Meal } from '@/domain/entities/meal/Meal';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { User } from '@/domain/entities/user/User';
import { mockForThrowingError } from '@/infra/repos/mongo/__tests__/mockForThrowingError';
import {
  clearMongoTestDB,
  setupMongoTestDB,
  teardownMongoTestDB,
} from '@/infra/repos/mongo/__tests__/setupMongoTestDB';
import { MongoDaysRepo } from '@/infra/repos/mongo/MongoDaysRepo';
import { MongoIngredientsRepo } from '@/infra/repos/mongo/MongoIngredientsRepo';
import { MongoMealsRepo } from '@/infra/repos/mongo/MongoMealsRepo';
import { MongoRecipesRepo } from '@/infra/repos/mongo/MongoRecipesRepo';
import { MongoUsersRepo } from '@/infra/repos/mongo/MongoUsersRepo';
import { Uuidv4IdGenerator } from '@/infra/services/IdGenerator/Uuidv4IdGenerator/Uuidv4IdGenerator';
import { MongoTransactionContext } from '@/infra/transaction-context/MongoTransactionContext/MongoTransactionContext';
import * as dayTestProps from '@/../tests/createProps/dayTestProps';
import * as ingredientTestProps from '@/../tests/createProps/ingredientTestProps';
import * as mealTestProps from '@/../tests/createProps/mealTestProps';
import * as recipeTestProps from '@/../tests/createProps/recipeTestProps';
import * as userTestProps from '@/../tests/createProps/userTestProps';
import { beforeEach, describe, expect, it } from 'vitest';
import { ReplaceMealByAnotherMealForUserInDayUsecase } from '../ReplaceMealByAnotherMealForUserInDayUsecase';

describe('ReplaceMealByAnotherMealForUserInDayUsecase', () => {
  let daysRepo: MongoDaysRepo;
  let ingredientsRepo: MongoIngredientsRepo;
  let mealsRepo: MongoMealsRepo;
  let recipesRepo: MongoRecipesRepo;
  let usersRepo: MongoUsersRepo;

  let usecase: ReplaceMealByAnotherMealForUserInDayUsecase;

  let user: User;
  let meal: Meal;
  let ingredient: Ingredient;
  let recipe: Recipe;
  let day: Day;

  let initialExpectations: () => Promise<void>;

  beforeAll(async () => {
    await setupMongoTestDB();
  });

  beforeEach(async () => {
    await clearMongoTestDB();

    daysRepo = new MongoDaysRepo();
    ingredientsRepo = new MongoIngredientsRepo();
    mealsRepo = new MongoMealsRepo();
    recipesRepo = new MongoRecipesRepo();
    usersRepo = new MongoUsersRepo();

    usecase = new ReplaceMealByAnotherMealForUserInDayUsecase(
      daysRepo,
      usersRepo,
      mealsRepo,
      recipesRepo,
      new Uuidv4IdGenerator(),
      new MongoTransactionContext(),
    );

    user = userTestProps.createTestUser();
    meal = mealTestProps.createTestMeal();
    ingredient = ingredientTestProps.createTestIngredient();
    recipe = recipeTestProps.createTestRecipe();
    day = dayTestProps.createEmptyTestDay();

    day.addMeal(meal.id);

    for (const line of meal.ingredientLines) {
      await ingredientsRepo.saveIngredient(line.ingredient);
    }
    await ingredientsRepo.saveIngredient(ingredient);

    await usersRepo.saveUser(user);
    await mealsRepo.saveMeal(meal);
    await recipesRepo.saveRecipe(recipe);
    await daysRepo.saveDay(day);

    initialExpectations = async () => {
      const allMeals = await mealsRepo.getAllMeals();
      expect(allMeals).toHaveLength(1);
      expect(allMeals[0].id).toBe(meal.id);

      const allDays = await daysRepo.getAllDays();
      expect(allDays).toHaveLength(1);
      expect(allDays[0].mealIds).toHaveLength(1);
      expect(allDays[0].mealIds[0]).toBe(meal.id);
    };
  });

  afterAll(async () => {
    await teardownMongoTestDB();
  });

  describe('Transactions', () => {
    it('should rollback if deleting the old meal fails', async () => {
      await initialExpectations();

      mockForThrowingError(mealsRepo, 'deleteMeal');

      await expect(() =>
        usecase.execute({
          dayId: day.id,
          userId: user.id,
          mealToReplaceId: meal.id,
          recipeId: recipe.id,
        }),
      ).rejects.toThrow('Mocked error in deleteMeal');

      await initialExpectations();
    });

    it('should rollback if saving the new meal fails', async () => {
      await initialExpectations();

      mockForThrowingError(mealsRepo, 'saveMeal');

      await expect(() =>
        usecase.execute({
          dayId: day.id,
          userId: user.id,
          mealToReplaceId: meal.id,
          recipeId: recipe.id,
        }),
      ).rejects.toThrow('Mocked error in saveMeal');

      await initialExpectations();
    });

    it('should rollback if saving the day fails', async () => {
      await initialExpectations();

      mockForThrowingError(daysRepo, 'saveDay');

      await expect(() =>
        usecase.execute({
          dayId: day.id,
          userId: user.id,
          mealToReplaceId: meal.id,
          recipeId: recipe.id,
        }),
      ).rejects.toThrow('Mocked error in saveDay');

      await initialExpectations();
    });
  });
});
