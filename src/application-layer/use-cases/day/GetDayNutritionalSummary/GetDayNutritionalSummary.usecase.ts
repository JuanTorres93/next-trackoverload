import { NotFoundError } from '@/domain/common/errors';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type GetDayNutritionalSummaryUsecaseRequest = {
  date: string;
  userId: string;
};

export type DayNutritionalSummary = {
  date: string;
  totalCalories: number;
  totalProtein: number;
  mealsCount: number;
};

export class GetDayNutritionalSummaryUsecase {
  constructor(private daysRepo: DaysRepo, private usersRepo: UsersRepo) {}

  async execute(
    request: GetDayNutritionalSummaryUsecaseRequest
  ): Promise<DayNutritionalSummary> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `GetDayNutritionalSummaryUsecase: User with id ${request.userId} not found`
      );
    }

    const day = await this.daysRepo.getDayByIdAndUserId(
      request.date,
      request.userId
    );

    if (!day) {
      throw new NotFoundError(
        `GetDayNutritionalSummaryUsecase: Day not found for date ${request.date} and userId ${request.userId}`
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
