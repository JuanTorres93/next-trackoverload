import { Day } from '@/domain/entities/day/Day';
import { User } from '@/domain/entities/user/User';
import { Uuidv4IdGenerator } from '@/infra/services/IdGenerator/Uuidv4IdGenerator/Uuidv4IdGenerator';
import {
  AddFakeMealToDayUsecase,
  AddFakeMealToDayUsecaseRequest,
} from '../AddFakeMealToDay.usecase';

import { MongoDaysRepo } from '@/infra/repos/mongo/MongoDaysRepo';
import { MongoFakeMealsRepo } from '@/infra/repos/mongo/MongoFakeMealsRepo';
import { MongoUsersRepo } from '@/infra/repos/mongo/MongoUsersRepo';
import { mockForThrowingError } from '@/infra/repos/mongo/__tests__/mockForThrowingError';
import {
  clearMongoTestDB,
  setupMongoTestDB,
  teardownMongoTestDB,
} from '@/infra/repos/mongo/__tests__/setupMongoTestDB';
import { MongoTransactionContext } from '@/infra/transaction-context/MongoTransactionContext/MongoTransactionContext';
import * as dayTestProps from '../../../../../../tests/createProps/dayTestProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';

describe('AddFakeMealToDayUsecase', () => {
  let daysRepo: MongoDaysRepo;
  let fakeMealsRepo: MongoFakeMealsRepo;
  let usersRepo: MongoUsersRepo;

  let addFakeMealToDayUsecase: AddFakeMealToDayUsecase;
  let day: Day;
  let user: User;

  let initialExpectations: () => Promise<void>;
  let validRequest: AddFakeMealToDayUsecaseRequest;

  beforeAll(async () => {
    await setupMongoTestDB();
  });

  beforeEach(async () => {
    await clearMongoTestDB();

    daysRepo = new MongoDaysRepo();
    fakeMealsRepo = new MongoFakeMealsRepo();
    usersRepo = new MongoUsersRepo();

    addFakeMealToDayUsecase = new AddFakeMealToDayUsecase(
      daysRepo,
      fakeMealsRepo,
      usersRepo,
      new Uuidv4IdGenerator(),
      new MongoTransactionContext(),
    );

    day = Day.create({
      ...dayTestProps.validDayProps(),
    });

    user = User.create({
      ...userTestProps.validUserProps,
    });

    await daysRepo.saveDay(day);
    await usersRepo.saveUser(user);

    validRequest = {
      dayId: day.id,
      userId: user.id,
      name: 'Fake Meal 1',
      calories: 500,
      protein: 30,
    };

    initialExpectations = async () => {
      const allDays = await daysRepo.getAllDays();
      expect(allDays).toHaveLength(1);
      const allFakeMeals = await fakeMealsRepo.getAllFakeMeals();
      expect(allFakeMeals).toHaveLength(0);
    };
  });

  afterAll(async () => {
    await teardownMongoTestDB();
  });

  describe('Transactions', () => {
    it('should rollback if saving fake meal fails', async () => {
      await initialExpectations();

      mockForThrowingError(fakeMealsRepo, 'saveFakeMeal');

      await expect(
        addFakeMealToDayUsecase.execute(validRequest),
      ).rejects.toThrow('Mocked error in saveFakeMeal');

      const dayAfter = await daysRepo.getDayByIdAndUserId(day.id, user.id);
      expect(dayAfter?.fakeMealIds).toHaveLength(0);
      const fakeMealsAfter = await fakeMealsRepo.getAllFakeMeals();
      expect(fakeMealsAfter).toHaveLength(0);
    });

    it('should rollback if saving day fails', async () => {
      await initialExpectations();

      mockForThrowingError(daysRepo, 'saveDay');

      await expect(
        addFakeMealToDayUsecase.execute(validRequest),
      ).rejects.toThrow('Mocked error in saveDay');

      // Verify that the fake meal was not saved
      const fakeMealsAfter = await fakeMealsRepo.getAllFakeMeals();
      expect(fakeMealsAfter).toHaveLength(0);
    });
  });
});
