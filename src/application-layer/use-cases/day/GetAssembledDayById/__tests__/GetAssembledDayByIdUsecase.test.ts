import { GetAssembledDayByIdUsecase } from '../GetAssembledDayByIdUsecase';

import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { Day } from '@/domain/entities/day/Day';
import { MemoryDaysRepo } from '@/infra/memory/MemoryDaysRepo';
import { MemoryMealsRepo } from '@/infra/memory/MemoryMealsRepo';
import { MemoryFakeMealsRepo } from '@/infra/memory/MemoryFakeMealsRepo';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { NotFoundError } from '@/domain/common/errors';
import { User } from '@/domain/entities/user/User';
import { Meal } from '@/domain/entities/meal/Meal';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';

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
      usersRepo
    );

    day = Day.create({
      ...vp.validDayProps(),
    });

    user = User.create({
      ...vp.validUserProps,
    });

    await daysRepo.saveDay(day);
    await usersRepo.saveUser(user);
  });

  describe('Found', () => {
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
      const meal = Meal.create(vp.validMealWithIngredientLines());
      const fakeMeal = FakeMeal.create(vp.validFakeMealProps);

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
  });

  describe('Errors', () => {
    it('should throw error if user does not exist', async () => {
      await expect(
        usecase.execute({
          dayId: day.id,
          userId: 'non-existent-user-id',
        })
      ).rejects.toThrowError(NotFoundError);

      await expect(
        usecase.execute({
          dayId: day.id,
          userId: 'non-existent-user-id',
        })
      ).rejects.toThrowError(/not found/);
    });

    it('should throw NotFoundError if day does not exist', async () => {
      await expect(
        usecase.execute({
          dayId: 'non-existent-day-id',
          userId: user.id,
        })
      ).rejects.toThrowError(NotFoundError);

      await expect(
        usecase.execute({
          dayId: 'non-existent-day-id',
          userId: user.id,
        })
      ).rejects.toThrowError(/GetAssembledDayByIdUsecase.*Day.*not found/);
    });
  });
});
