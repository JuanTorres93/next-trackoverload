import { DayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type RemoveMealFromDayUsecaseRequest = {
  date: Date;
  userId: string;
  mealId: string;
};

export class RemoveMealFromDayUsecase {
  constructor(private daysRepo: DaysRepo, private usersRepo: UsersRepo) {}

  async execute(request: RemoveMealFromDayUsecaseRequest): Promise<DayDTO> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `RemoveMealFromDayUsecase: User with id ${request.userId} not found`
      );
    }

    const day = await this.daysRepo.getDayByIdAndUserId(
      request.date.toISOString(),
      request.userId
    );
    if (!day) {
      throw new ValidationError(
        `RemoveMealFromDayUsecase: Day not found for date ${request.date.toISOString()} and userId ${
          request.userId
        }`
      );
    }

    // NOTE: meal id validation is done inside the Day entity
    day.removeMealById(request.mealId);
    await this.daysRepo.saveDay(day);

    return toDayDTO(day);
  }
}
