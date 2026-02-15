import { Day } from '@/domain/entities/day/Day';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { User } from '@/domain/entities/user/User';
import { mockForThrowingError } from '@/infra/repos/mongo/__tests__/mockForThrowingError';
import {
  clearMongoTestDB,
  setupMongoTestDB,
  teardownMongoTestDB,
} from '@/infra/repos/mongo/__tests__/setupMongoTestDB';
import { MongoDaysRepo } from '@/infra/repos/mongo/MongoDaysRepo';
import { MongoFakeMealsRepo } from '@/infra/repos/mongo/MongoFakeMealsRepo';
import { MongoUsersRepo } from '@/infra/repos/mongo/MongoUsersRepo';
import { MongoTransactionContext } from '@/infra/transaction-context/MongoTransactionContext/MongoTransactionContext';
import { beforeEach, describe } from 'vitest';
import * as dayTestProps from '../../../../../../tests/createProps/dayTestProps';
import * as fakeMealTestProps from '../../../../../../tests/createProps/fakeMealTestProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import { RemoveFakeMealFromDayUsecase } from '../RemoveFakeMealFromDay.usecase';

describe('RemoveFakeMealFromDayUsecase', () => {
  let daysRepo: MongoDaysRepo;
  let usersRepo: MongoUsersRepo;
  let fakeMealsRepo: MongoFakeMealsRepo;

  let removeFakeMealFromDayUsecase: RemoveFakeMealFromDayUsecase;
  let user: User;
  let fakeMeal: FakeMeal;
  let day: Day;

  let initialExpectations: () => Promise<void>;

  beforeAll(async () => {
    await setupMongoTestDB();
  });

  beforeEach(async () => {
    await clearMongoTestDB();

    daysRepo = new MongoDaysRepo();
    usersRepo = new MongoUsersRepo();
    fakeMealsRepo = new MongoFakeMealsRepo();

    removeFakeMealFromDayUsecase = new RemoveFakeMealFromDayUsecase(
      daysRepo,
      usersRepo,
      fakeMealsRepo,
      new MongoTransactionContext(),
    );

    fakeMeal = fakeMealTestProps.createTestFakeMeal();

    day = Day.create({
      ...dayTestProps.validDayProps(),
    });
    day.addMeal(fakeMeal.id);

    user = User.create({
      ...userTestProps.validUserProps,
    });

    await usersRepo.saveUser(user);
    await fakeMealsRepo.saveFakeMeal(fakeMeal);
    await daysRepo.saveDay(day);

    initialExpectations = async () => {
      const allFakeMeals = await fakeMealsRepo.getAllFakeMeals();
      expect(allFakeMeals).toHaveLength(1);

      const allDays = await daysRepo.getAllDays();
      expect(allDays).toHaveLength(1);

      expect(allDays[0].mealIds).toHaveLength(1);
    };
  });

  afterAll(async () => {
    await teardownMongoTestDB();
  });

  describe('Transactions', () => {
    it('should rollback if deleteFakeMeal fails', async () => {
      await initialExpectations();

      mockForThrowingError(fakeMealsRepo, 'deleteFakeMeal');

      await expect(
        removeFakeMealFromDayUsecase.execute({
          dayId: day.id,
          userId: user.id,
          fakeMealId: fakeMeal.id,
        }),
      ).rejects.toThrow('Mocked error in deleteFakeMeal');

      await initialExpectations();
    });

    it('should rollback if saveDay fails', async () => {
      await initialExpectations();

      mockForThrowingError(daysRepo, 'saveDay');

      await expect(
        removeFakeMealFromDayUsecase.execute({
          dayId: day.id,
          userId: user.id,
          fakeMealId: fakeMeal.id,
        }),
      ).rejects.toThrow('Mocked error in saveDay');

      await initialExpectations();
    });
  });
});
