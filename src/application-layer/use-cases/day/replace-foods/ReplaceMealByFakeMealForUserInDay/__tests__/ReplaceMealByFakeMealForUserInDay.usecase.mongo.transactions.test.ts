import { Day } from '@/domain/entities/day/Day';
import { Meal } from '@/domain/entities/meal/Meal';
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
import { MongoUsersRepo } from '@/infra/repos/mongo/MongoUsersRepo';
import { Uuidv4IdGenerator } from '@/infra/services/IdGenerator/Uuidv4IdGenerator/Uuidv4IdGenerator';
import { MongoTransactionContext } from '@/infra/transaction-context/MongoTransactionContext/MongoTransactionContext';
import * as dayTestProps from '@/../tests/createProps/dayTestProps';
import * as mealTestProps from '@/../tests/createProps/mealTestProps';
import * as userTestProps from '@/../tests/createProps/userTestProps';
import { beforeEach, describe, expect, it } from 'vitest';
import { ReplaceMealByFakeMealForUserInDayUsecase } from '../ReplaceMealByFakeMealForUserInDayUsecase';

describe('ReplaceMealByFakeMealForUserInDayUsecase', () => {
  let daysRepo: MongoDaysRepo;
  let mealsRepo: MongoMealsRepo;
  let fakeMealsRepo: MongoFakeMealsRepo;
  let ingredientsRepo: MongoIngredientsRepo;
  let usersRepo: MongoUsersRepo;

  let usecase: ReplaceMealByFakeMealForUserInDayUsecase;

  let user: User;
  let meal: Meal;
  let day: Day;

  const fakeMealData = {
    name: 'Fake Chicken',
    calories: 300,
    protein: 25,
  };

  let initialExpectations: () => Promise<void>;

  beforeAll(async () => {
    await setupMongoTestDB();
  });

  beforeEach(async () => {
    await clearMongoTestDB();

    daysRepo = new MongoDaysRepo();
    mealsRepo = new MongoMealsRepo();
    fakeMealsRepo = new MongoFakeMealsRepo();
    ingredientsRepo = new MongoIngredientsRepo();
    usersRepo = new MongoUsersRepo();

    usecase = new ReplaceMealByFakeMealForUserInDayUsecase(
      daysRepo,
      usersRepo,
      mealsRepo,
      fakeMealsRepo,
      new Uuidv4IdGenerator(),
      new MongoTransactionContext(),
    );

    user = userTestProps.createTestUser();
    meal = mealTestProps.createTestMeal();
    day = dayTestProps.createEmptyTestDay();

    day.addMeal(meal.id);

    for (const line of meal.ingredientLines) {
      await ingredientsRepo.saveIngredient(line.ingredient);
    }

    await usersRepo.saveUser(user);
    await mealsRepo.saveMeal(meal);
    await daysRepo.saveDay(day);

    initialExpectations = async () => {
      const allMeals = await mealsRepo.getAllMeals();
      expect(allMeals).toHaveLength(1);
      expect(allMeals[0].id).toBe(meal.id);

      const allFakeMeals = await fakeMealsRepo.getAllFakeMeals();
      expect(allFakeMeals).toHaveLength(0);

      const allDays = await daysRepo.getAllDays();
      expect(allDays).toHaveLength(1);
      expect(allDays[0].mealIds).toHaveLength(1);
      expect(allDays[0].fakeMealIds).toHaveLength(0);
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
          mealIdToReplace: meal.id,
          ...fakeMealData,
        }),
      ).rejects.toThrow('Mocked error in deleteMeal');

      await initialExpectations();
    });

    it('should rollback if saving the new fake meal fails', async () => {
      await initialExpectations();

      mockForThrowingError(fakeMealsRepo, 'saveFakeMeal');

      await expect(() =>
        usecase.execute({
          dayId: day.id,
          userId: user.id,
          mealIdToReplace: meal.id,
          ...fakeMealData,
        }),
      ).rejects.toThrow('Mocked error in saveFakeMeal');

      await initialExpectations();
    });

    it('should rollback if saving the day fails', async () => {
      await initialExpectations();

      mockForThrowingError(daysRepo, 'saveDay');

      await expect(() =>
        usecase.execute({
          dayId: day.id,
          userId: user.id,
          mealIdToReplace: meal.id,
          ...fakeMealData,
        }),
      ).rejects.toThrow('Mocked error in saveDay');

      await initialExpectations();
    });
  });
});
