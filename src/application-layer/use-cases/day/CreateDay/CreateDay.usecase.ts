import { DayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';
import {
  AlreadyExistsError,
  NotFoundError,
  PermissionError,
} from '@/domain/common/errors';
import { Day } from '@/domain/entities/day/Day';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { DayId } from '@/domain/value-objects/DayId/DayId';

export type CreateDayUsecaseRequest = {
  day: number;
  month: number;
  year: number;
  actorUserId: string;
  targetUserId: string;
};

export class CreateDayUsecase {
  constructor(
    private daysRepo: DaysRepo,
    private usersRepo: UsersRepo,
  ) {}

  async execute(request: CreateDayUsecaseRequest): Promise<DayDTO> {
    if (request.actorUserId !== request.targetUserId) {
      throw new PermissionError(
        'CreateDayUsecase: cannot create day for another user',
      );
    }

    const user = await this.usersRepo.getUserById(request.targetUserId);
    if (!user) {
      throw new NotFoundError(
        `CreateDayUsecase: user with id ${request.targetUserId} not found`,
      );
    }

    const dayId = DayId.create({
      day: request.day,
      month: request.month,
      year: request.year,
    });

    const existingDay = await this.daysRepo.getDayByIdAndUserId(
      dayId.value,
      request.targetUserId,
    );

    if (existingDay) {
      throw new AlreadyExistsError(
        `CreateDayUsecase: day for date ${request.day}/${request.month}/${request.year} for user with id ${request.targetUserId} already exists`,
      );
    }

    const newDay = Day.create({
      day: request.day,
      month: request.month,
      year: request.year,
      userId: request.targetUserId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.daysRepo.saveDay(newDay);

    return toDayDTO(newDay);
  }
}
