import {
  AlreadyExistsError,
  NotFoundError,
  PermissionError,
} from '@/domain/common/errors';
import { CreateDayUsecaseRequest } from '../CreateDay/CreateDay.usecase';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { Day } from '@/domain/entities/day/Day';
import { DayId } from '@/domain/value-objects/DayId/DayId';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';

export async function createDayNoSaveInRepo(
  usersRepo: UsersRepo,
  daysRepo: DaysRepo,
  request: CreateDayUsecaseRequest,
): Promise<Day> {
  if (request.actorUserId !== request.targetUserId) {
    throw new PermissionError(
      'createDayNoSaveInRepo: cannot create day for another user',
    );
  }

  const user = await usersRepo.getUserById(request.targetUserId);
  if (!user) {
    throw new NotFoundError(
      `createDayNoSaveInRepo: user with id ${request.targetUserId} not found`,
    );
  }

  const dayId = DayId.create({
    day: request.day,
    month: request.month,
    year: request.year,
  });

  const existingDay = await daysRepo.getDayByIdAndUserId(
    dayId.value,
    request.targetUserId,
  );

  if (existingDay) {
    throw new AlreadyExistsError(
      `createDayNoSaveInRepo: day for date ${request.day}/${request.month}/${request.year} for user with id ${request.targetUserId} already exists`,
    );
  }

  const newDay = Day.create({
    day: request.day,
    month: request.month,
    year: request.year,
    userId: request.targetUserId,
  });

  return newDay;
}
