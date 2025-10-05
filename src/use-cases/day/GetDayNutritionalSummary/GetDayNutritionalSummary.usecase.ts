import { NotFoundError } from '@/domain/common/errors';
import { validateDate } from '@/domain/common/validation';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';

export type GetDayNutritionalSummaryUsecaseRequest = {
  date: Date;
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

    const day = await this.daysRepo.getDayById(request.date.toISOString());

    if (!day) {
      throw new NotFoundError(
        `GetDayNutritionalSummaryUsecase: Day not found for date ${request.date.toISOString()}`
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
