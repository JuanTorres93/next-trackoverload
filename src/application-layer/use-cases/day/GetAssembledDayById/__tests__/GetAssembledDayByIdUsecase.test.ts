import { GetAssembledDayByIdUsecase } from '../GetAssembledDayByIdUsecase';

import * as dto from '@/../tests/dtoProperties';
import { NotFoundError } from '@/domain/common/errors';
import { Day } from '@/domain/entities/day/Day';
import { User } from '@/domain/entities/user/User';
import { MemoryDaysRepo } from '@/infra/repos/memory/MemoryDaysRepo';
import { MemoryFakeMealsRepo } from '@/infra/repos/memory/MemoryFakeMealsRepo';
import { MemoryMealsRepo } from '@/infra/repos/memory/MemoryMealsRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import * as dayTestProps from '../../../../../../tests/createProps/dayTestProps';
import * as fakeMealTestProps from '../../../../../../tests/createProps/fakeMealTestProps';
import * as mealTestProps from '../../../../../../tests/createProps/mealTestProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';

describe('GetAssembledDayByIdUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let mealsRepo: MemoryMealsRepo;
  let fakeMealsRepo: MemoryFakeMealsRepo;
  let usersRepo: MemoryUsersRepo;

  let usecase: GetAssembledDayByIdUsecase;
  let day: Day;
  let user: User;

  beforeEach(async () => {
    daysRepo = new MemoryDaysRepo();
    mealsRepo = new MemoryMealsRepo();
    fakeMealsRepo = new MemoryFakeMealsRepo();
    usersRepo = new MemoryUsersRepo();

    usecase = new GetAssembledDayByIdUsecase(
      daysRepo,
      mealsRepo,
      fakeMealsRepo,
      usersRepo,
    );

    day = Day.create({
      ...dayTestProps.validDayProps(),
    });

    user = User.create({
      ...userTestProps.validUserProps,
    });

    await daysRepo.saveDay(day);
    await usersRepo.saveUser(user);
  });

  describe('Execution', () => {
    it('should return AssembledDayDTO', async () => {
      const result = await usecase.execute({
        dayId: day.id,
        userId: user.id,
      });

      expect(result).not.toBeInstanceOf(Day);
      for (const prop of dto.assembledDayDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });

    it('should assemble related meals and fake meals', async () => {
      const meal = mealTestProps.createTestMeal();
      const fakeMeal = fakeMealTestProps.createTestFakeMeal();

      await mealsRepo.saveMeal(meal);
      await fakeMealsRepo.saveFakeMeal(fakeMeal);

      // Update day to include these meals
      day.addMeal(meal.id);
      day.addFakeMeal(fakeMeal.id);
      await daysRepo.saveDay(day);

      const result = await usecase.execute({
        dayId: day.id,
        userId: user.id,
      });

      expect(result!.meals.length).toBe(1);
      expect(result!.meals[0].id).toBe(meal.id);
      expect(result!.meals[0].name).toBe(meal.name);

      expect(result!.fakeMeals.length).toBe(1);
      expect(result!.fakeMeals[0].id).toBe(fakeMeal.id);
      expect(result!.fakeMeals[0].name).toBe(fakeMeal.name);
    });

    it('should return null if day does not exist', async () => {
      const result = await usecase.execute({
        dayId: 'non-existent-day-id',
        userId: user.id,
      });

      expect(result).toBeNull();
    });

    it('should return null if day exists but belongs to another user', async () => {
      const anotherUser = User.create({
        ...userTestProps.validUserProps,
        id: 'another-user-id',
      });

      await usersRepo.saveUser(anotherUser);

      const result = await usecase.execute({
        dayId: day.id,
        userId: anotherUser.id,
      });

      expect(result).toBeNull();
    });
  });

  describe('Errors', () => {
    it('should throw error if user does not exist', async () => {
      const request = {
        dayId: day.id,
        userId: 'non-existent-user-id',
      };

      await expect(usecase.execute(request)).rejects.toThrowError(
        NotFoundError,
      );
      await expect(usecase.execute(request)).rejects.toThrowError(
        /GetAssembledDayByIdUsecase.*User.*not found/,
      );
    });
  });
});
