import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { toDayDTO } from '@/application-layer/dtos/DayDTO';
import { NotFoundError, PermissionError } from '@/domain/common/errors';
import { Day } from '@/domain/entities/day/Day';
import { User } from '@/domain/entities/user/User';
import { MemoryDaysRepo } from '@/infra/repos/memory/MemoryDaysRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreateDayUsecase } from '../CreateDay.usecase';

describe('CreateDayUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let usersRepo: MemoryUsersRepo;
  let createDayUsecase: CreateDayUsecase;
  let user: User;

  beforeEach(async () => {
    daysRepo = new MemoryDaysRepo();
    usersRepo = new MemoryUsersRepo();
    createDayUsecase = new CreateDayUsecase(daysRepo, usersRepo);

    user = User.create({
      ...vp.validUserProps,
    });

    await usersRepo.saveUser(user);
  });

  describe('Creation', () => {
    it('should create and save a new day', async () => {
      const request = {
        day: vp.validDayProps().day,
        month: vp.validDayProps().month,
        year: vp.validDayProps().year,
        actorUserId: vp.userId,
        targetUserId: vp.userId,
      };

      const day = await createDayUsecase.execute(request);

      expect(day.id).toEqual('20231001');
      expect(day.mealIds).toEqual([]);
      expect(day.fakeMealIds).toEqual([]);
      expect(day).toHaveProperty('createdAt');
      expect(day).toHaveProperty('updatedAt');

      const savedDay = await daysRepo.getDayById(day.id);

      // @ts-expect-error savedDay won't be null
      expect(toDayDTO(savedDay)).toEqual(day);
    });

    it('should return DayDTO', async () => {
      const request = {
        day: vp.validDayProps().day,
        month: vp.validDayProps().month,
        year: vp.validDayProps().year,
        actorUserId: vp.userId,
        targetUserId: vp.userId,
      };

      const day = await createDayUsecase.execute(request);

      expect(day).not.toBeInstanceOf(Day);
      for (const prop of dto.dayDTOProperties) {
        expect(day).toHaveProperty(prop);
      }
    });
  });

  describe('Errors', () => {
    it('should throw error if user does not exist', async () => {
      const request = {
        day: vp.validDayProps().day,
        month: vp.validDayProps().month,
        year: vp.validDayProps().year,
        actorUserId: 'non-existent',
        targetUserId: 'non-existent',
      };

      await expect(createDayUsecase.execute(request)).rejects.toThrow(
        NotFoundError
      );
      await expect(createDayUsecase.execute(request)).rejects.toThrow(
        /CreateDayUsecase.*user.*not.*found/
      );
    });

    it('should throw error when trying to create a day for another user', async () => {
      const request = {
        day: vp.validDayProps().day,
        month: vp.validDayProps().month,
        year: vp.validDayProps().year,
        actorUserId: vp.userId,
        targetUserId: 'another-user-id',
      };

      await expect(createDayUsecase.execute(request)).rejects.toThrow(
        PermissionError
      );
      await expect(createDayUsecase.execute(request)).rejects.toThrow(
        /CreateDayUsecase: cannot create day for another user/
      );
    });
  });
});
