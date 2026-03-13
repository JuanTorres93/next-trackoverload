import * as dto from '@/../tests/dtoProperties';
import { NotFoundError } from '@/domain/common/errors';
import { Day } from '@/domain/entities/day/Day';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { User } from '@/domain/entities/user/User';
import { MemoryDaysRepo } from '@/infra/repos/memory/MemoryDaysRepo';
import { MemoryFakeMealsRepo } from '@/infra/repos/memory/MemoryFakeMealsRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { Uuidv4IdGenerator } from '@/infra/services/IdGenerator/Uuidv4IdGenerator/Uuidv4IdGenerator';
import { MemoryTransactionContext } from '@/infra/transaction-context/MemoryTransactionContext/MemoryTransactionContext';
import * as dayTestProps from '@/../tests/createProps/dayTestProps';
import * as fakeMealTestProps from '@/../tests/createProps/fakeMealTestProps';
import * as userTestProps from '@/../tests/createProps/userTestProps';
import { beforeEach, describe, expect, it } from 'vitest';
import { ReplaceFakeMealByAnotherFakeMealForUserInDayUsecase } from '../ReplaceFakeMealByAnotherFakeMealForUserInDayUsecase';

describe('ReplaceFakeMealByAnotherFakeMealForUserInDayUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let usersRepo: MemoryUsersRepo;
  let fakeMealsRepo: MemoryFakeMealsRepo;
  let usecase: ReplaceFakeMealByAnotherFakeMealForUserInDayUsecase;

  let user: User;
  let fakeMeal: FakeMeal;
  let day: Day;

  const newFakeMealData = {
    name: 'New Fake Steak',
    calories: 450,
    protein: 40,
  };

  beforeEach(async () => {
    daysRepo = new MemoryDaysRepo();
    usersRepo = new MemoryUsersRepo();
    fakeMealsRepo = new MemoryFakeMealsRepo();

    usecase = new ReplaceFakeMealByAnotherFakeMealForUserInDayUsecase(
      daysRepo,
      usersRepo,
      fakeMealsRepo,
      new Uuidv4IdGenerator(),
      new MemoryTransactionContext(),
    );

    user = userTestProps.createTestUser();
    fakeMeal = fakeMealTestProps.createTestFakeMeal();
    day = dayTestProps.createEmptyTestDay();

    day.addFakeMeal(fakeMeal.id);

    await usersRepo.saveUser(user);
    await fakeMealsRepo.saveFakeMeal(fakeMeal);
    await daysRepo.saveDay(day);
  });

  describe('Replacement', () => {
    it('should replace the old fake meal with a new fake meal in the day', async () => {
      const result = await usecase.execute({
        dayId: day.id,
        userId: userTestProps.userId,
        fakeMealIdToReplace: fakeMeal.id,
        ...newFakeMealData,
      });

      expect(result.fakeMealIds).toHaveLength(1);
      expect(result.fakeMealIds).not.toContain(fakeMeal.id);
    });

    it('should return a DayDTO', async () => {
      const result = await usecase.execute({
        dayId: day.id,
        userId: userTestProps.userId,
        fakeMealIdToReplace: fakeMeal.id,
        ...newFakeMealData,
      });

      expect(result).not.toBeInstanceOf(Day);
      for (const prop of dto.dayDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });
  });

  describe('Side effects', () => {
    it('should delete the old fake meal from the repo', async () => {
      const fakeMealsBefore = await fakeMealsRepo.getAllFakeMeals();
      expect(fakeMealsBefore).toHaveLength(1);

      await usecase.execute({
        dayId: day.id,
        userId: userTestProps.userId,
        fakeMealIdToReplace: fakeMeal.id,
        ...newFakeMealData,
      });

      const fakeMealsAfter = await fakeMealsRepo.getAllFakeMeals();
      expect(fakeMealsAfter).toHaveLength(1);
      expect(fakeMealsAfter[0].id).not.toBe(fakeMeal.id);
    });

    it('should save the new fake meal to the repo', async () => {
      await usecase.execute({
        dayId: day.id,
        userId: userTestProps.userId,
        fakeMealIdToReplace: fakeMeal.id,
        ...newFakeMealData,
      });

      const fakeMealsAfter = await fakeMealsRepo.getAllFakeMeals();
      expect(fakeMealsAfter).toHaveLength(1);
      expect(fakeMealsAfter[0].name).toBe(newFakeMealData.name);
      expect(fakeMealsAfter[0].calories).toBe(newFakeMealData.calories);
      expect(fakeMealsAfter[0].protein).toBe(newFakeMealData.protein);
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError if user does not exist', async () => {
      const request = {
        dayId: day.id,
        userId: 'non-existent-user',
        fakeMealIdToReplace: fakeMeal.id,
        ...newFakeMealData,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /ReplaceFakeMealByAnotherFakeMeal.*User.*not found/,
      );
    });

    it('should throw NotFoundError if day does not exist', async () => {
      const request = {
        dayId: 'non-existent-day',
        userId: userTestProps.userId,
        fakeMealIdToReplace: fakeMeal.id,
        ...newFakeMealData,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /ReplaceFakeMealByAnotherFakeMeal.*Day.*not found/,
      );
    });
  });
});
