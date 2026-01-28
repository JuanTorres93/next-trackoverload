import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { toDayDTO } from '@/application-layer/dtos/DayDTO';
import {
  AlreadyExistsError,
  NotFoundError,
  PermissionError,
} from '@/domain/common/errors';
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
    it('should createa new day', async () => {
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

  describe('Side effects', () => {
    it('should save the new day in the DaysRepo', async () => {
      const request = {
        day: vp.validDayProps().day,
        month: vp.validDayProps().month,
        year: vp.validDayProps().year,
        actorUserId: vp.userId,
        targetUserId: vp.userId,
      };

      const initialDaysCount = daysRepo.countForTesting();

      const day = await createDayUsecase.execute(request);

      const finalDaysCount = daysRepo.countForTesting();

      expect(finalDaysCount).toBe(initialDaysCount + 1);

      const savedDay = await daysRepo.getDayById(day.id);

      expect(toDayDTO(savedDay!)).toEqual(day);
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
        NotFoundError,
      );
      await expect(createDayUsecase.execute(request)).rejects.toThrow(
        /createDayNoSaveInRepo.*user.*not.*found/,
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
        PermissionError,
      );
      await expect(createDayUsecase.execute(request)).rejects.toThrow(
        /createDayNoSaveInRepo: cannot create day for another user/,
      );
    });

    it('should throw error if Day already exists', async () => {
      const existingDay = Day.create({
        day: vp.validDayProps().day,
        month: vp.validDayProps().month,
        year: vp.validDayProps().year,
        userId: vp.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await daysRepo.saveDay(existingDay);

      const request = {
        day: vp.validDayProps().day,
        month: vp.validDayProps().month,
        year: vp.validDayProps().year,
        actorUserId: vp.userId,
        targetUserId: vp.userId,
      };

      await expect(createDayUsecase.execute(request)).rejects.toThrow(
        AlreadyExistsError,
      );
      await expect(createDayUsecase.execute(request)).rejects.toThrow(
        /createDayNoSaveInRepo: day.*already exists/,
      );
    });
  });
});
