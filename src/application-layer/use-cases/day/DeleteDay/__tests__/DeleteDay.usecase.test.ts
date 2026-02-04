import * as dayTestProps from '../../../../../../tests/createProps/dayTestProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import { NotFoundError } from '@/domain/common/errors';
import { Day } from '@/domain/entities/day/Day';
import { User } from '@/domain/entities/user/User';
import { MemoryDaysRepo } from '@/infra/repos/memory/MemoryDaysRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { MemoryFakeMealsRepo } from '@/infra/repos/memory/MemoryFakeMealsRepo';
import { MemoryMealsRepo } from '@/infra/repos/memory/MemoryMealsRepo';
import { MemoryUnitOfWork } from '@/infra/unit-of-work/memoryUnitOfWork/MemoryUnitOfWork';
import { beforeEach, describe, expect, it } from 'vitest';
import { DeleteDayUsecase } from '../DeleteDay.usecase';

describe('DeleteDayUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let usersRepo: MemoryUsersRepo;
  let mealsRepo: MemoryMealsRepo;
  let fakeMealsRepo: MemoryFakeMealsRepo;
  let unitOfWork: MemoryUnitOfWork;

  let deleteDayUsecase: DeleteDayUsecase;
  let user: User;
  let day: Day;

  beforeEach(async () => {
    daysRepo = new MemoryDaysRepo();
    usersRepo = new MemoryUsersRepo();
    mealsRepo = new MemoryMealsRepo();
    fakeMealsRepo = new MemoryFakeMealsRepo();
    unitOfWork = new MemoryUnitOfWork();

    deleteDayUsecase = new DeleteDayUsecase(
      daysRepo,
      usersRepo,
      mealsRepo,
      fakeMealsRepo,
      unitOfWork,
    );

    day = Day.create({
      ...dayTestProps.validDayProps(),
    });

    user = User.create({
      ...userTestProps.validUserProps,
    });

    await usersRepo.saveUser(user);
    await daysRepo.saveDay(day);
  });

  describe('Deletion', () => {
    it('should delete a day', async () => {
      await deleteDayUsecase.execute({
        dayId: day.id,
        userId: userTestProps.userId,
      });

      const result = await daysRepo.getDayById(
        dayTestProps.dateId.toISOString(),
      );
      expect(result).toBeNull();
    });
  });

  describe('Errors', () => {
    it('should throw error when deleting non-existent day', async () => {
      await expect(
        deleteDayUsecase.execute({
          dayId: 'non-existent',
          userId: userTestProps.userId,
        }),
      ).rejects.toThrow(NotFoundError);
      await expect(
        deleteDayUsecase.execute({
          dayId: 'non-existent',
          userId: userTestProps.userId,
        }),
      ).rejects.toThrow(/DeleteDayUsecase.*Day not found/);
    });

    it('should throw error if user does not exist', async () => {
      await expect(
        deleteDayUsecase.execute({
          dayId: day.id,
          userId: 'non-existent',
        }),
      ).rejects.toThrow(NotFoundError);

      await expect(
        deleteDayUsecase.execute({
          dayId: day.id,
          userId: 'non-existent',
        }),
      ).rejects.toThrow(/DeleteDayUsecase.*User.*not.*found/);
    });

    it("should throw error when trying to delete another user's Day", async () => {
      const anotherUser = User.create({
        ...userTestProps.validUserProps,
        id: 'another-user-id',
        email: 'another-user@example.com',
      });

      await usersRepo.saveUser(anotherUser);

      const request = {
        dayId: day.id,
        userId: anotherUser.id,
      };

      await expect(deleteDayUsecase.execute(request)).rejects.toThrow(
        NotFoundError,
      );

      await expect(deleteDayUsecase.execute(request)).rejects.toThrow(
        /DeleteDayUsecase.*Day.*not.*found/,
      );
    });
  });
});
