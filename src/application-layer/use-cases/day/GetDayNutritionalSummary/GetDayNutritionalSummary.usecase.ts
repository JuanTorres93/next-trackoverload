import { NotFoundError } from '@/domain/common/errors';
import {
  validateDate,
  validateNonEmptyString,
} from '@/domain/common/validation';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';

export type GetDayNutritionalSummaryUsecaseRequest = {
  date: Date;
  userId: string;
};

export type DayNutritionalSummary = {
  date: Date;
  totalCalories: number;
  totalProtein: number;
  mealsCount: number;
};

export class GetDayNutritionalSummaryUsecase {
  constructor(private daysRepo: DaysRepo) {}

  async execute(
    request: GetDayNutritionalSummaryUsecaseRequest
  ): Promise<DayNutritionalSummary> {
    validateDate(request.date, 'GetDayNutritionalSummaryUsecase date');
    validateNonEmptyString(
      request.userId,
      'GetDayNutritionalSummaryUsecase userId'
    );

    const day = await this.daysRepo.getDayByIdAndUserId(
      request.date.toISOString(),
      request.userId
    );

    if (!day) {
      throw new NotFoundError(
        `GetDayNutritionalSummaryUsecase: Day not found for date ${request.date.toISOString()} and userId ${
          request.userId
        }`
      );
    }

    return {
      date: day.id,
      totalCalories: day.calories,
      totalProtein: day.protein,
      mealsCount: day.meals.length,
    };
  }
}
