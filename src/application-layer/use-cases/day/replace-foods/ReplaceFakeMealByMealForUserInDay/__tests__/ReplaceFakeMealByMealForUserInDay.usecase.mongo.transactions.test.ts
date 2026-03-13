import { Day } from '@/domain/entities/day/Day';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { User } from '@/domain/entities/user/User';
import { mockForThrowingError } from '@/infra/repos/mongo/__tests__/mockForThrowingError';
import {
  clearMongoTestDB,
  setupMongoTestDB,
  teardownMongoTestDB,
} from '@/infra/repos/mongo/__tests__/setupMongoTestDB';
import { MongoDaysRepo } from '@/infra/repos/mongo/MongoDaysRepo';
import { MongoFakeMealsRepo } from '@/infra/repos/mongo/MongoFakeMealsRepo';
import { MongoIngredientsRepo } from '@/infra/repos/mongo/MongoIngredientsRepo';
import { MongoMealsRepo } from '@/infra/repos/mongo/MongoMealsRepo';
import { MongoRecipesRepo } from '@/infra/repos/mongo/MongoRecipesRepo';
import { MongoUsersRepo } from '@/infra/repos/mongo/MongoUsersRepo';
import { Uuidv4IdGenerator } from '@/infra/services/IdGenerator/Uuidv4IdGenerator/Uuidv4IdGenerator';
import { MongoTransactionContext } from '@/infra/transaction-context/MongoTransactionContext/MongoTransactionContext';
import * as dayTestProps from '@/../tests/createProps/dayTestProps';
import * as fakeMealTestProps from '@/../tests/createProps/fakeMealTestProps';
import * as ingredientTestProps from '@/../tests/createProps/ingredientTestProps';
import * as recipeTestProps from '@/../tests/createProps/recipeTestProps';
import * as userTestProps from '@/../tests/createProps/userTestProps';
import { beforeEach, describe, expect, it } from 'vitest';
import { ReplaceFakeMealByMealForUserInDayUsecase } from '../ReplaceFakeMealByMealForUserInDayUsecase';

describe('ReplaceFakeMealByMealForUserInDayUsecase - Mongo Transactions', () => {
  let daysRepo: MongoDaysRepo;
  let fakeMealsRepo: MongoFakeMealsRepo;
  let ingredientsRepo: MongoIngredientsRepo;
  let mealsRepo: MongoMealsRepo;
  let recipesRepo: MongoRecipesRepo;
  let usersRepo: MongoUsersRepo;

  let usecase: ReplaceFakeMealByMealForUserInDayUsecase;

  let user: User;
  let fakeMeal: FakeMeal;
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
    fakeMealsRepo = new MongoFakeMealsRepo();
    ingredientsRepo = new MongoIngredientsRepo();
    mealsRepo = new MongoMealsRepo();
    recipesRepo = new MongoRecipesRepo();
    usersRepo = new MongoUsersRepo();

    usecase = new ReplaceFakeMealByMealForUserInDayUsecase(
      daysRepo,
      usersRepo,
      mealsRepo,
      fakeMealsRepo,
      recipesRepo,
      new Uuidv4IdGenerator(),
      new MongoTransactionContext(),
    );

    user = userTestProps.createTestUser();
    fakeMeal = fakeMealTestProps.createTestFakeMeal();
    ingredient = ingredientTestProps.createTestIngredient();
    recipe = recipeTestProps.createTestRecipe();
    day = dayTestProps.createEmptyTestDay();

    day.addFakeMeal(fakeMeal.id);

    await ingredientsRepo.saveIngredient(ingredient);
    await usersRepo.saveUser(user);
    await fakeMealsRepo.saveFakeMeal(fakeMeal);
    await recipesRepo.saveRecipe(recipe);
    await daysRepo.saveDay(day);

    initialExpectations = async () => {
      const allFakeMeals = await fakeMealsRepo.getAllFakeMeals();
      expect(allFakeMeals).toHaveLength(1);
      expect(allFakeMeals[0].id).toBe(fakeMeal.id);

      const allMeals = await mealsRepo.getAllMeals();
      expect(allMeals).toHaveLength(0);

      const allDays = await daysRepo.getAllDays();
      expect(allDays).toHaveLength(1);
      expect(allDays[0].fakeMealIds).toHaveLength(1);
      expect(allDays[0].fakeMealIds).toContain(fakeMeal.id);
      expect(allDays[0].mealIds).toHaveLength(0);
    };
  });

  afterAll(async () => {
    await teardownMongoTestDB();
  });

  describe('Transactions', () => {
    it('should rollback if deleting the old fake meal fails', async () => {
      await initialExpectations();

      mockForThrowingError(fakeMealsRepo, 'deleteFakeMeal');

      await expect(() =>
        usecase.execute({
          dayId: day.id,
          userId: user.id,
          fakeMealIdToReplace: fakeMeal.id,
          recipeId: recipe.id,
        }),
      ).rejects.toThrow('Mocked error in deleteFakeMeal');

      await initialExpectations();
    });

    it('should rollback if saving the new meal fails', async () => {
      await initialExpectations();

      mockForThrowingError(mealsRepo, 'saveMeal');

      await expect(() =>
        usecase.execute({
          dayId: day.id,
          userId: user.id,
          fakeMealIdToReplace: fakeMeal.id,
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
          fakeMealIdToReplace: fakeMeal.id,
          recipeId: recipe.id,
        }),
      ).rejects.toThrow('Mocked error in saveDay');

      await initialExpectations();
    });
  });
});
