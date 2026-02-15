import { NotFoundError } from '@/domain/common/errors';
import { Day } from '@/domain/entities/day/Day';
import { User } from '@/domain/entities/user/User';
import { MemoryDaysRepo } from '@/infra/repos/memory/MemoryDaysRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { MemoryTransactionContext } from '@/infra/transaction-context/MemoryTransactionContext/MemoryTransactionContext';
import { beforeEach, describe, expect, it } from 'vitest';
import { RemoveFakeMealFromDayUsecase } from '../RemoveFakeMealFromDay.usecase';

import * as dayTestProps from '../../../../../../tests/createProps/dayTestProps';
import * as fakeMealTestProps from '../../../../../../tests/createProps/fakeMealTestProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import * as dto from '@/../tests/dtoProperties';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { MemoryFakeMealsRepo } from '@/infra/repos/memory/MemoryFakeMealsRepo';

describe('RemoveMealFromDayUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let usersRepo: MemoryUsersRepo;
  let fakeMealsRepo: MemoryFakeMealsRepo;

  let removeFakeMealFromDayUsecase: RemoveFakeMealFromDayUsecase;
  let user: User;
  let fakeMeal: FakeMeal;
  let day: Day;

  beforeEach(async () => {
    daysRepo = new MemoryDaysRepo();
    usersRepo = new MemoryUsersRepo();
    fakeMealsRepo = new MemoryFakeMealsRepo();

    removeFakeMealFromDayUsecase = new RemoveFakeMealFromDayUsecase(
      daysRepo,
      usersRepo,
      fakeMealsRepo,
      new MemoryTransactionContext(),
    );

    fakeMeal = fakeMealTestProps.createTestFakeMeal();

    day = dayTestProps.createEmptyTestDay();

    user = User.create({
      ...userTestProps.validUserProps,
    });

    day.addMeal(fakeMeal.id);

    await usersRepo.saveUser(user);
    await fakeMealsRepo.saveFakeMeal(fakeMeal);
    await daysRepo.saveDay(day);
  });

  describe('Removal', () => {
    it('should remove fakeMeal from day', async () => {
      const result = await removeFakeMealFromDayUsecase.execute({
        dayId: day.id,
        userId: userTestProps.userId,
        fakeMealId: fakeMeal.id,
      });

      expect(result.mealIds).toHaveLength(0);
    });

    it('should not affect meals', async () => {
      day.addMeal('meal1');
      await daysRepo.saveDay(day);

      await removeFakeMealFromDayUsecase.execute({
        dayId: day.id,
        userId: userTestProps.userId,
        fakeMealId: fakeMeal.id,
      });

      const updatedDay = await daysRepo.getDayByIdAndUserId(
        day.id,
        userTestProps.userId,
      );
      expect(updatedDay!.mealIds).toHaveLength(1);
      expect(updatedDay!.mealIds[0]).toBe('meal1');
    });

    it('should return a DayDTO', async () => {
      const result = await removeFakeMealFromDayUsecase.execute({
        dayId: day.id,
        userId: userTestProps.userId,
        fakeMealId: fakeMeal.id,
      });

      expect(result).not.toBeInstanceOf(Day);
      for (const prop of dto.dayDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });

    it('should update day in repo', async () => {
      await removeFakeMealFromDayUsecase.execute({
        dayId: day.id,
        userId: userTestProps.userId,
        fakeMealId: fakeMeal.id,
      });

      const updatedDay = await daysRepo.getDayByIdAndUserId(
        day.id,
        userTestProps.userId,
      );
      expect(updatedDay!.mealIds).toHaveLength(0);
    });
  });

  describe('Side effects', () => {
    it('should remove fakeMeal from repo', async () => {
      const initialMeals = await fakeMealsRepo.getAllFakeMeals();
      expect(initialMeals).toHaveLength(1);

      await removeFakeMealFromDayUsecase.execute({
        dayId: day.id,
        userId: userTestProps.userId,
        fakeMealId: fakeMeal.id,
      });

      const mealsAfterRemoval = await fakeMealsRepo.getAllFakeMeals();
      expect(mealsAfterRemoval).toHaveLength(0);
    });
  });

  describe('Errors', () => {
    it('should throw error if day does not exist', async () => {
      const request = {
        dayId: '11111001',
        userId: userTestProps.userId,
        fakeMealId: fakeMeal.id,
      };

      await expect(
        removeFakeMealFromDayUsecase.execute(request),
      ).rejects.toThrow(NotFoundError);
      await expect(
        removeFakeMealFromDayUsecase.execute(request),
      ).rejects.toThrow(/RemoveFakeMealFromDay.*Day.*not/);
    });

    it('should throw error if user does not exist', async () => {
      const request = {
        dayId: day.id,
        userId: 'non-existent',
        fakeMealId: fakeMeal.id,
      };

      await expect(
        removeFakeMealFromDayUsecase.execute(request),
      ).rejects.toThrow(NotFoundError);

      await expect(
        removeFakeMealFromDayUsecase.execute(request),
      ).rejects.toThrow(/RemoveFakeMealFromDay.*User.*not.*found/);
    });

    it("should throw error when trying to remove meal from another user's day", async () => {
      const anotherUser = User.create({
        ...userTestProps.validUserProps,
        id: 'another-user-id',
        email: 'another-user@example.com',
      });

      await usersRepo.saveUser(anotherUser);

      const request = {
        dayId: day.id,
        userId: anotherUser.id,
        fakeMealId: fakeMeal.id,
      };

      await expect(
        removeFakeMealFromDayUsecase.execute(request),
      ).rejects.toThrow(NotFoundError);

      await expect(
        removeFakeMealFromDayUsecase.execute(request),
      ).rejects.toThrow(/RemoveFakeMealFromDayUsecase.*Day.*not.*found/);
    });
  });
});
