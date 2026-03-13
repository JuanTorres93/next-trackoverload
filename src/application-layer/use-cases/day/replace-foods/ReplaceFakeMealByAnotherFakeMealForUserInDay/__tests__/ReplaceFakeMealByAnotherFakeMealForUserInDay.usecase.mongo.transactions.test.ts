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
import { Uuidv4IdGenerator } from '@/infra/services/IdGenerator/Uuidv4IdGenerator/Uuidv4IdGenerator';
import { MongoTransactionContext } from '@/infra/transaction-context/MongoTransactionContext/MongoTransactionContext';
import * as dayTestProps from '@/../tests/createProps/dayTestProps';
import * as fakeMealTestProps from '@/../tests/createProps/fakeMealTestProps';
import * as userTestProps from '@/../tests/createProps/userTestProps';
import { beforeEach, describe, expect, it } from 'vitest';
import { ReplaceFakeMealByAnotherFakeMealForUserInDayUsecase } from '../ReplaceFakeMealByAnotherFakeMealForUserInDayUsecase';

describe('ReplaceFakeMealByAnotherFakeMealForUserInDayUsecase - Mongo Transactions', () => {
  let daysRepo: MongoDaysRepo;
  let fakeMealsRepo: MongoFakeMealsRepo;
  let usersRepo: MongoUsersRepo;

  let usecase: ReplaceFakeMealByAnotherFakeMealForUserInDayUsecase;

  let user: User;
  let fakeMeal: FakeMeal;
  let day: Day;

  const newFakeMealData = {
    name: 'New Fake Steak',
    calories: 450,
    protein: 40,
  };

  let initialExpectations: () => Promise<void>;

  beforeAll(async () => {
    await setupMongoTestDB();
  });

  beforeEach(async () => {
    await clearMongoTestDB();

    daysRepo = new MongoDaysRepo();
    fakeMealsRepo = new MongoFakeMealsRepo();
    usersRepo = new MongoUsersRepo();

    usecase = new ReplaceFakeMealByAnotherFakeMealForUserInDayUsecase(
      daysRepo,
      usersRepo,
      fakeMealsRepo,
      new Uuidv4IdGenerator(),
      new MongoTransactionContext(),
    );

    user = userTestProps.createTestUser();
    fakeMeal = fakeMealTestProps.createTestFakeMeal();
    day = dayTestProps.createEmptyTestDay();

    day.addFakeMeal(fakeMeal.id);

    await usersRepo.saveUser(user);
    await fakeMealsRepo.saveFakeMeal(fakeMeal);
    await daysRepo.saveDay(day);

    initialExpectations = async () => {
      const allFakeMeals = await fakeMealsRepo.getAllFakeMeals();
      expect(allFakeMeals).toHaveLength(1);
      expect(allFakeMeals[0].id).toBe(fakeMeal.id);

      const allDays = await daysRepo.getAllDays();
      expect(allDays).toHaveLength(1);
      expect(allDays[0].fakeMealIds).toHaveLength(1);
      expect(allDays[0].fakeMealIds).toContain(fakeMeal.id);
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
          ...newFakeMealData,
        }),
      ).rejects.toThrow('Mocked error in deleteFakeMeal');

      await initialExpectations();
    });

    it('should rollback if saving the new fake meal fails', async () => {
      await initialExpectations();

      mockForThrowingError(fakeMealsRepo, 'saveFakeMeal');

      await expect(() =>
        usecase.execute({
          dayId: day.id,
          userId: user.id,
          fakeMealIdToReplace: fakeMeal.id,
          ...newFakeMealData,
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
          fakeMealIdToReplace: fakeMeal.id,
          ...newFakeMealData,
        }),
      ).rejects.toThrow('Mocked error in saveDay');

      await initialExpectations();
    });
  });
});
