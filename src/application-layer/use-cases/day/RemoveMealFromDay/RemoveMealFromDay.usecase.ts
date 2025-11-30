import { DayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';
import { ValidationError } from '@/domain/common/errors';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';

export type RemoveMealFromDayUsecaseRequest = {
  date: Date;
  userId: string;
  mealId: string;
};

export class RemoveMealFromDayUsecase {
  constructor(private daysRepo: DaysRepo) {}

  async execute(request: RemoveMealFromDayUsecaseRequest): Promise<DayDTO> {
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
