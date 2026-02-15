import { Day } from '@/domain/entities/day/Day';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
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
import { MongoTransactionContext } from '@/infra/transaction-context/MongoTransactionContext/MongoTransactionContext';
import { beforeEach, describe } from 'vitest';
import * as dayTestProps from '../../../../../../tests/createProps/dayTestProps';
import { createTestFakeMeal } from '../../../../../../tests/createProps/fakeMealTestProps';
import { createTestMeal } from '../../../../../../tests/createProps/mealTestProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import { DeleteDayUsecase } from '../DeleteDay.usecase';

describe('DeleteDayUsecase', () => {
  let daysRepo: MongoDaysRepo;
  let usersRepo: MongoUsersRepo;
  let mealsRepo: MongoMealsRepo;
  let fakeMealsRepo: MongoFakeMealsRepo;
  let ingredientsRepo: MongoIngredientsRepo;

  let deleteDayUsecase: DeleteDayUsecase;
  let user: User;
  let day: Day;
  let meal: Meal;
  let fakeMeal: FakeMeal;

  let initialExpectations: () => Promise<void>;

  beforeAll(async () => {
    await setupMongoTestDB();
  });

  beforeEach(async () => {
    await clearMongoTestDB();

    daysRepo = new MongoDaysRepo();
    usersRepo = new MongoUsersRepo();
    mealsRepo = new MongoMealsRepo();
    fakeMealsRepo = new MongoFakeMealsRepo();
    ingredientsRepo = new MongoIngredientsRepo();

    deleteDayUsecase = new DeleteDayUsecase(
      daysRepo,
      usersRepo,
      mealsRepo,
      fakeMealsRepo,
      new MongoTransactionContext(),
    );

    meal = createTestMeal();
    fakeMeal = createTestFakeMeal();

    day = dayTestProps.createEmptyTestDay();

    day.addMeal(meal.id);
    day.addFakeMeal(fakeMeal.id);

    user = User.create({
      ...userTestProps.validUserProps,
    });

    // Save ingredients first (required by meal ingredient lines)
    for (const line of meal.ingredientLines) {
      await ingredientsRepo.saveIngredient(line.ingredient);
    }

    await mealsRepo.saveMeal(meal);
    await fakeMealsRepo.saveFakeMeal(fakeMeal);
    await daysRepo.saveDay(day);
    await usersRepo.saveUser(user);

    initialExpectations = async () => {
      const allMeals = await mealsRepo.getAllMeals();
      expect(allMeals.length).toBe(1);
      const allFakeMeals = await fakeMealsRepo.getAllFakeMeals();
      expect(allFakeMeals.length).toBe(1);
      const allDays = await daysRepo.getAllDays();
      expect(allDays.length).toBe(1);
      const dayFromRepo = allDays[0];
      expect(dayFromRepo.mealIds).toHaveLength(1);
      expect(dayFromRepo.fakeMealIds).toHaveLength(1);
    };
  });

  afterAll(async () => {
    await teardownMongoTestDB();
  });

  describe('Transactions', () => {
    it('should rollback if error in deleteMultipleMeals', async () => {
      await initialExpectations();

      mockForThrowingError(mealsRepo, 'deleteMultipleMeals');

      await expect(
        deleteDayUsecase.execute({ dayId: day.id, userId: user.id }),
      ).rejects.toThrow('Mocked error in deleteMultipleMeals');

      await initialExpectations();
    });

    it('should rollback if error in deleteMultipleFakeMeals', async () => {
      await initialExpectations();

      mockForThrowingError(fakeMealsRepo, 'deleteMultipleFakeMeals');

      await expect(
        deleteDayUsecase.execute({ dayId: day.id, userId: user.id }),
      ).rejects.toThrow('Mocked error in deleteMultipleFakeMeals');

      await initialExpectations();
    });

    it('should rollback if error in deleteDayForUser', async () => {
      await initialExpectations();

      mockForThrowingError(daysRepo, 'deleteDayForUser');

      await expect(
        deleteDayUsecase.execute({ dayId: day.id, userId: user.id }),
      ).rejects.toThrow('Mocked error in deleteDayForUser');

      await initialExpectations();
    });
  });
});
