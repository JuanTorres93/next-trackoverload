import { logNoTest } from "@/utils/logNoTest";

import {
  AlreadyExistsError,
  NotFoundError,
  PermissionError,
} from "../../../../domain/common/errors";
import { Day } from "../../../../domain/entities/day/Day";
import { DaysRepo } from "../../../../domain/repos/DaysRepo.port";
import { UsersRepo } from "../../../../domain/repos/UsersRepo.port";
import { DayId } from "../../../../domain/value-objects/DayId/DayId";
import { CreateDayUsecaseRequest } from "../CreateDay/CreateDay.usecase";

export async function createDayNoSaveInRepo(
  usersRepo: UsersRepo,
  daysRepo: DaysRepo,
  request: CreateDayUsecaseRequest,
): Promise<Day> {
  if (request.actorUserId !== request.targetUserId) {
    throw new PermissionError(
      "createDayNoSaveInRepo: cannot create day for another user",
    );
  }

  const user = await usersRepo.getUserById(request.targetUserId);
  if (!user) {
    logNoTest(
      `createDayNoSaveInRepo: user with id ${request.targetUserId} not found`,
    );

    throw new NotFoundError("No existe el usuario.");
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
    logNoTest(
      `createDayNoSaveInRepo: day for date ${request.day}/${request.month}/${request.year} for user with id ${request.targetUserId} already exists`,
    );

    throw new AlreadyExistsError("El día para esa fecha ya existe.");
  }

  const newDay = Day.create({
    day: request.day,
    month: request.month,
    year: request.year,
    userId: request.targetUserId,
  });

  return newDay;
}
