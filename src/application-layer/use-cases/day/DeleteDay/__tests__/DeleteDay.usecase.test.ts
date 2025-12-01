import * as vp from '@/../tests/createProps';
import { NotFoundError } from '@/domain/common/errors';
import { Day } from '@/domain/entities/day/Day';
import { User } from '@/domain/entities/user/User';
import { MemoryDaysRepo } from '@/infra/memory/MemoryDaysRepo';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { DeleteDayUsecase } from '../DeleteDay.usecase';

describe('DeleteDayUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let usersRepo: MemoryUsersRepo;
  let deleteDayUsecase: DeleteDayUsecase;
  let user: User;
  let day: Day;

  beforeEach(async () => {
    daysRepo = new MemoryDaysRepo();
    usersRepo = new MemoryUsersRepo();
    deleteDayUsecase = new DeleteDayUsecase(daysRepo, usersRepo);

    day = Day.create({
      ...vp.validDayProps(),
    });

    user = User.create({
      ...vp.validUserProps,
    });

    await usersRepo.saveUser(user);
    await daysRepo.saveDay(day);
  });

  it('should delete a day', async () => {
    await deleteDayUsecase.execute({ date: day.id, userId: vp.userId });

    const result = await daysRepo.getDayById(vp.dateId.toISOString());
    expect(result).toBeNull();
  });

  it('should throw error when deleting non-existent day', async () => {
    await expect(
      deleteDayUsecase.execute({ date: 'non-existent', userId: vp.userId })
    ).rejects.toThrow(NotFoundError);
    await expect(
      deleteDayUsecase.execute({ date: 'non-existent', userId: vp.userId })
    ).rejects.toThrow(/DeleteDayUsecase.*Day not found/);
  });

  it('should throw error if user does not exist', async () => {
    await expect(
      deleteDayUsecase.execute({
        date: day.id,
        userId: 'non-existent',
      })
    ).rejects.toThrow(NotFoundError);

    await expect(
      deleteDayUsecase.execute({
        date: day.id,
        userId: 'non-existent',
      })
    ).rejects.toThrow(/DeleteDayUsecase.*User.*not.*found/);
  });
});
