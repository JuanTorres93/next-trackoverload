import { GetMultipleAssembledDaysByIdsUsecase } from '../GetMultipleAssembledDaysByIdsUsecase';

import * as dto from '@/../tests/dtoProperties';
import { NotFoundError } from '@/domain/common/errors';
import { Day } from '@/domain/entities/day/Day';
import { User } from '@/domain/entities/user/User';
import { MemoryDaysRepo } from '@/infra/repos/memory/MemoryDaysRepo';
import { MemoryFakeMealsRepo } from '@/infra/repos/memory/MemoryFakeMealsRepo';
import { MemoryMealsRepo } from '@/infra/repos/memory/MemoryMealsRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import * as dayTestProps from '../../../../../../tests/createProps/dayTestProps';
import * as fakeMealTestProps from '../../../../../../tests/createProps/fakeMealTestProps';
import * as mealTestProps from '../../../../../../tests/createProps/mealTestProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';

describe('GetMultipleAssembledDaysByIdsUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let mealsRepo: MemoryMealsRepo;
  let fakeMealsRepo: MemoryFakeMealsRepo;
  let usersRepo: MemoryUsersRepo;

  let usecase: GetMultipleAssembledDaysByIdsUsecase;
  let day1: Day;
  let day2: Day;
  let day3: Day;
  let user: User;

  beforeEach(async () => {
    daysRepo = new MemoryDaysRepo();
    mealsRepo = new MemoryMealsRepo();
    fakeMealsRepo = new MemoryFakeMealsRepo();
    usersRepo = new MemoryUsersRepo();

    usecase = new GetMultipleAssembledDaysByIdsUsecase(
      daysRepo,
      mealsRepo,
      fakeMealsRepo,
      usersRepo,
    );

    user = userTestProps.createTestUser();

    day1 = dayTestProps.createEmptyTestDay({
      day: 1,
    });
    day2 = dayTestProps.createEmptyTestDay({
      day: 2,
    });
    day3 = dayTestProps.createEmptyTestDay({
      day: 3,
    });

    await daysRepo.saveDay(day1);
    await daysRepo.saveDay(day2);
    await daysRepo.saveDay(day3);
    await usersRepo.saveUser(user);
  });

  describe('Execution', () => {
    it('should return array of AssembledDayDTO', async () => {
      const result = await usecase.execute({
        dayIds: [day1.id, day2.id],
        userId: user.id,
      });

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(2);

      expect(result[0]).not.toBeInstanceOf(Day);
      for (const prop of dto.assembledDayDTOProperties) {
        expect(result[0]).toHaveProperty(prop);
      }
    });

    it('should assemble related meals and fake meals for each day', async () => {
      const meal1 = mealTestProps.createTestMeal({ id: 'meal-1' });
      const meal2 = mealTestProps.createTestMeal({ id: 'meal-2' });
      const fakeMeal1 = fakeMealTestProps.createTestFakeMeal({
        id: 'fakemeal-1',
      });
      const fakeMeal2 = fakeMealTestProps.createTestFakeMeal({
        id: 'fakemeal-2',
      });

      await mealsRepo.saveMeal(meal1);
      await mealsRepo.saveMeal(meal2);
      await fakeMealsRepo.saveFakeMeal(fakeMeal1);
      await fakeMealsRepo.saveFakeMeal(fakeMeal2);

      // day1 has meal1 and fakeMeal1
      day1.addMeal(meal1.id);
      day1.addFakeMeal(fakeMeal1.id);
      await daysRepo.saveDay(day1);

      // day2 has meal2 and fakeMeal2
      day2.addMeal(meal2.id);
      day2.addFakeMeal(fakeMeal2.id);
      await daysRepo.saveDay(day2);

      const result = await usecase.execute({
        dayIds: [day1.id, day2.id],
        userId: user.id,
      });

      expect(result.length).toBe(2);

      // Check day1
      const resultDay1 = result.find((d) => d.id === day1.id);
      expect(resultDay1).toBeDefined();
      expect(resultDay1!.meals.length).toBe(1);
      expect(resultDay1!.meals[0].id).toBe(meal1.id);
      expect(resultDay1!.meals[0].name).toBe(meal1.name);
      expect(resultDay1!.fakeMeals.length).toBe(1);
      expect(resultDay1!.fakeMeals[0].id).toBe(fakeMeal1.id);
      expect(resultDay1!.fakeMeals[0].name).toBe(fakeMeal1.name);

      // Check day2
      const resultDay2 = result.find((d) => d.id === day2.id);
      expect(resultDay2).toBeDefined();
      expect(resultDay2!.meals.length).toBe(1);
      expect(resultDay2!.meals[0].id).toBe(meal2.id);
      expect(resultDay2!.meals[0].name).toBe(meal2.name);
      expect(resultDay2!.fakeMeals.length).toBe(1);
      expect(resultDay2!.fakeMeals[0].id).toBe(fakeMeal2.id);
      expect(resultDay2!.fakeMeals[0].name).toBe(fakeMeal2.name);
    });

    it('should only return days that belong to the user', async () => {
      const anotherUser = userTestProps.createTestUser({
        id: 'another-user-id',
      });
      await usersRepo.saveUser(anotherUser);

      const anotherUserDay = dayTestProps.createEmptyTestDay({
        userId: anotherUser.id,
        day: 4,
      });
      await daysRepo.saveDay(anotherUserDay);

      const result = await usecase.execute({
        dayIds: [day1.id, day2.id, anotherUserDay.id],
        userId: user.id,
      });

      expect(result.length).toBe(2);
      expect(result.find((d) => d.id === anotherUserDay.id)).toBeUndefined();
    });

    it('should handle days with no meals or fake meals', async () => {
      const result = await usecase.execute({
        dayIds: [day1.id, day2.id],
        userId: user.id,
      });

      expect(result.length).toBe(2);
      expect(result[0].meals).toEqual([]);
      expect(result[0].fakeMeals).toEqual([]);
      expect(result[1].meals).toEqual([]);
      expect(result[1].fakeMeals).toEqual([]);
    });
  });

  describe('Errors', () => {
    it('should throw error if user does not exist', async () => {
      const request = {
        dayIds: [day1.id, day2.id],
        userId: 'non-existent-user-id',
      };

      await expect(usecase.execute(request)).rejects.toThrowError(
        NotFoundError,
      );
      await expect(usecase.execute(request)).rejects.toThrowError(
        /GetMultipleAssembledDaysByIdsUsecase.*User.*not found/,
      );
    });
  });
});
