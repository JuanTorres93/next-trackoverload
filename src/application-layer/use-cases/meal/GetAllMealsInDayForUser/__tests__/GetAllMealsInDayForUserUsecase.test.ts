import { NotFoundError } from '@/domain/common/errors';
import { GetAllMealsInDayForUserUsecase } from '../GetAllMealsInDayForUserUsecase';
import { Day } from '@/domain/entities/day/Day';
import { Meal } from '@/domain/entities/meal/Meal';
import { User } from '@/domain/entities/user/User';
import { MemoryDaysRepo } from '@/infra/repos/memory/MemoryDaysRepo';
import { MemoryMealsRepo } from '@/infra/repos/memory/MemoryMealsRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import * as dto from '@/../tests/dtoProperties';
import * as dayTestProps from '@/../tests/createProps/dayTestProps';
import * as mealTestProps from '@/../tests/createProps/mealTestProps';
import * as userTestProps from '@/../tests/createProps/userTestProps';

describe('GetAllMealsInDayForUserUsecase', () => {
  let mealsRepo: MemoryMealsRepo;
  let daysRepo: MemoryDaysRepo;
  let usersRepo: MemoryUsersRepo;
  let usecase: GetAllMealsInDayForUserUsecase;
  let user: User;
  let day: Day;
  let meal: Meal;

  beforeEach(async () => {
    mealsRepo = new MemoryMealsRepo();
    daysRepo = new MemoryDaysRepo();
    usersRepo = new MemoryUsersRepo();
    usecase = new GetAllMealsInDayForUserUsecase(
      mealsRepo,
      daysRepo,
      usersRepo,
    );

    user = userTestProps.createTestUser();

    meal = mealTestProps.createTestMeal();

    day = Day.create(dayTestProps.validDayProps());
    day.addMeal(meal.id);

    await usersRepo.saveUser(user);
    await mealsRepo.saveMeal(meal);
    await daysRepo.saveDay(day);
  });

  describe('Execution', () => {
    it('should return an array of MealDTOs', async () => {
      const result = await usecase.execute({
        userId: user.id,
        dayId: day.id,
      });

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      expect(result[0]).not.toBeInstanceOf(Meal);
      for (const prop of dto.mealDTOProperties) {
        expect(result[0]).toHaveProperty(prop);
      }
    });

    it('should return an empty array if the day has no meals', async () => {
      const emptyDay = Day.create({ ...dayTestProps.validDayProps(), day: 2 });
      await daysRepo.saveDay(emptyDay);

      const result = await usecase.execute({
        userId: user.id,
        dayId: emptyDay.id,
      });

      expect(result).toEqual([]);
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError if the user does not exist', async () => {
      const request = { userId: 'non-existent-user-id', dayId: day.id };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /GetAllMealsInDayForUserUsecase.*User.*not found/,
      );
    });

    it('should throw NotFoundError if the day does not exist', async () => {
      const request = { userId: user.id, dayId: 'non-existent-day-id' };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /GetAllMealsInDayForUserUsecase.*Day.*not found/,
      );
    });
  });
});
