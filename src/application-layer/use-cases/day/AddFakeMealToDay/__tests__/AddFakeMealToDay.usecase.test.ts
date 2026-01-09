import { NotFoundError } from '@/domain/common/errors';
import { Day } from '@/domain/entities/day/Day';
import { MemoryDaysRepo } from '@/infra/repos/memory/MemoryDaysRepo';
import { MemoryFakeMealsRepo } from '@/infra/repos/memory/MemoryFakeMealsRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { AddFakeMealToDayUsecase } from '../AddFakeMealToDay.usecase';
import { User } from '@/domain/entities/user/User';
import { Uuidv4IdGenerator } from '@/infra/services/IdGenerator/Uuidv4IdGenerator/Uuidv4IdGenerator';

import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';

describe('AddFakeMealToDayUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let fakeMealsRepo: MemoryFakeMealsRepo;
  let usersRepo: MemoryUsersRepo;

  let addFakeMealToDayUsecase: AddFakeMealToDayUsecase;
  let day: Day;
  let user: User;
  let anotherUser: User;

  beforeEach(async () => {
    daysRepo = new MemoryDaysRepo();
    fakeMealsRepo = new MemoryFakeMealsRepo();
    usersRepo = new MemoryUsersRepo();
    addFakeMealToDayUsecase = new AddFakeMealToDayUsecase(
      daysRepo,
      fakeMealsRepo,
      usersRepo,
      new Uuidv4IdGenerator()
    );

    day = Day.create({
      ...vp.validDayProps(),
    });

    user = User.create({
      ...vp.validUserProps,
    });

    anotherUser = User.create({
      ...vp.validUserProps,
      id: 'another-user-id',
    });

    await daysRepo.saveDay(day);
    await usersRepo.saveUser(user);
    await usersRepo.saveUser(anotherUser);
  });

  describe('Addition', () => {
    it('should add fake meal to existing day', async () => {
      expect(day.fakeMealIds).toHaveLength(0);

      const result = await addFakeMealToDayUsecase.execute({
        dayId: day.id,
        userId: user.id,
        name: vp.validFakeMealProps.name,
        calories: vp.validFakeMealProps.calories,
        protein: vp.validFakeMealProps.protein,
      });

      expect(result.fakeMealIds).toHaveLength(1);
    });

    it('should return DayDTO', async () => {
      const result = await addFakeMealToDayUsecase.execute({
        dayId: day.id,
        userId: user.id,
        name: vp.validFakeMealProps.name,
        calories: vp.validFakeMealProps.calories,
        protein: vp.validFakeMealProps.protein,
      });

      expect(result).not.toBeInstanceOf(Day);
      for (const prop of dto.dayDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });
  });

  describe('Side effects', () => {
    it('should create new fake meal', async () => {
      const currentFakeMealCount = await fakeMealsRepo.getAllFakeMeals();
      expect(currentFakeMealCount).toHaveLength(0);

      await addFakeMealToDayUsecase.execute({
        dayId: day.id,
        userId: user.id,
        name: vp.validFakeMealProps.name,
        calories: vp.validFakeMealProps.calories,
        protein: vp.validFakeMealProps.protein,
      });

      const afterFakeMealCount = await fakeMealsRepo.getAllFakeMeals();
      expect(afterFakeMealCount).toHaveLength(1);
    });
  });

  describe('Errors', () => {
    it('should throw error if user does not exist', async () => {
      const request = {
        dayId: day.id,
        userId: 'non-existent',
        name: vp.validFakeMealProps.name,
        calories: vp.validFakeMealProps.calories,
        protein: vp.validFakeMealProps.protein,
      };

      await expect(addFakeMealToDayUsecase.execute(request)).rejects.toThrow(
        NotFoundError
      );

      await expect(addFakeMealToDayUsecase.execute(request)).rejects.toThrow(
        /AddFakeMealToDay.*User.*not.*found/
      );
    });

    it("should throw error when trying to add fake meal to another user's day", async () => {
      const request = {
        dayId: day.id,
        userId: anotherUser.id,
        name: vp.validFakeMealProps.name,
        calories: vp.validFakeMealProps.calories,
        protein: vp.validFakeMealProps.protein,
      };

      await expect(addFakeMealToDayUsecase.execute(request)).rejects.toThrow(
        NotFoundError
      );

      await expect(addFakeMealToDayUsecase.execute(request)).rejects.toThrow(
        /AddFakeMealToDay.*Day.*not.*found/
      );
    });
  });
});
