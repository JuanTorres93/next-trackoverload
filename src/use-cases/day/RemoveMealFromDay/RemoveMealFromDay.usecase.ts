import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { Day } from '@/domain/entities/day/Day';
import { ValidationError } from '@/domain/common/errors';
import { validateDate } from '@/domain/common/validation';

export type RemoveMealFromDayUsecaseRequest = {
  date: Date;
  mealId: string;
};

export class RemoveMealFromDayUsecase {
  constructor(private daysRepo: DaysRepo) {}

  async execute(request: RemoveMealFromDayUsecaseRequest): Promise<Day> {
    validateDate(request.date, 'RemoveMealFromDayUsecase: date');

    const day = await this.daysRepo.getDayById(request.date.toISOString());
    if (!day) {
      throw new ValidationError(
        `RemoveMealFromDayUsecase: Day not found for date ${request.date.toISOString()}`
      );
    }

    // NOTE: meal id validation is done inside the Day entity
    day.removeMealById(request.mealId);
    await this.daysRepo.saveDay(day);

    return day;
  }
}
