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
import { MongoIngredientsRepo } from '@/infra/repos/mongo/MongoIngredientsRepo';
import { MongoMealsRepo } from '@/infra/repos/mongo/MongoMealsRepo';
import { MongoUsersRepo } from '@/infra/repos/mongo/MongoUsersRepo';
import { MongoTransactionContext } from '@/infra/transaction-context/MongoTransactionContext/MongoTransactionContext';
import { beforeEach, describe } from 'vitest';
import * as dayTestProps from '../../../../../../tests/createProps/dayTestProps';
import { createTestMeal } from '../../../../../../tests/createProps/mealTestProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import { RemoveMealFromDayUsecase } from '../RemoveMealFromDay.usecase';

describe('RemoveMealFromDayUsecase', () => {
  let daysRepo: MongoDaysRepo;
  let usersRepo: MongoUsersRepo;
  let mealsRepo: MongoMealsRepo;
  let ingredientsRepo: MongoIngredientsRepo;

  let removeMealFromDayUsecase: RemoveMealFromDayUsecase;
  let user: User;
  let meal: Meal;
  let day: Day;

  let initialExpectations: () => Promise<void>;

  beforeAll(async () => {
    await setupMongoTestDB();
  });

  beforeEach(async () => {
    await clearMongoTestDB();

    daysRepo = new MongoDaysRepo();
    usersRepo = new MongoUsersRepo();
    mealsRepo = new MongoMealsRepo();
    ingredientsRepo = new MongoIngredientsRepo();

    removeMealFromDayUsecase = new RemoveMealFromDayUsecase(
      daysRepo,
      usersRepo,
      mealsRepo,
      new MongoTransactionContext(),
    );

    meal = createTestMeal();

    day = dayTestProps.createEmptyTestDay();

    day.addMeal(meal.id);

    user = User.create({
      ...userTestProps.validUserProps,
    });

    // Save ingredients first (required by meal ingredient lines)
    for (const line of meal.ingredientLines) {
      await ingredientsRepo.saveIngredient(line.ingredient);
    }

    await usersRepo.saveUser(user);
    await mealsRepo.saveMeal(meal);
    await daysRepo.saveDay(day);

    initialExpectations = async () => {
      const allMeals = await mealsRepo.getAllMeals();
      expect(allMeals).toHaveLength(1);

      const allDays = await daysRepo.getAllDays();
      expect(allDays).toHaveLength(1);

      expect(allDays[0].mealIds).toHaveLength(1);
    };
  });

  afterAll(async () => {
    await teardownMongoTestDB();
  });

  describe('Transactions', () => {
    it('should rollback if deleteMeal fails', async () => {
      await initialExpectations();

      mockForThrowingError(mealsRepo, 'deleteMeal');

      await expect(
        removeMealFromDayUsecase.execute({
          dayId: day.id,
          userId: user.id,
          mealId: meal.id,
        }),
      ).rejects.toThrow('Mocked error in deleteMeal');

      await initialExpectations();
    });

    it('should rollback if saveDay fails', async () => {
      await initialExpectations();

      mockForThrowingError(daysRepo, 'saveDay');

      await expect(
        removeMealFromDayUsecase.execute({
          dayId: day.id,
          userId: user.id,
          mealId: meal.id,
        }),
      ).rejects.toThrow('Mocked error in saveDay');

      await initialExpectations();
    });
  });
});
