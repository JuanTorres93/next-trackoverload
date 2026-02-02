import { DayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';
import { NotFoundError } from '@/domain/common/errors';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type RemoveMealFromDayUsecaseRequest = {
  date: string;
  userId: string;
  mealId: string;
};

export class RemoveMealFromDayUsecase {
  constructor(
    private daysRepo: DaysRepo,
    private usersRepo: UsersRepo,
    private mealsRepo: MealsRepo,
  ) {}

  async execute(request: RemoveMealFromDayUsecaseRequest): Promise<DayDTO> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `RemoveMealFromDayUsecase: User with id ${request.userId} not found`,
      );
    }

    const day = await this.daysRepo.getDayByIdAndUserId(
      request.date,
      request.userId,
    );
    if (!day) {
      throw new NotFoundError(
        `RemoveMealFromDayUsecase: Day not found for date ${request.date} and userId ${request.userId}`,
      );
    }

    day.removeMealById(request.mealId);
    await this.mealsRepo.deleteMeal(request.mealId);
    await this.daysRepo.saveDay(day);

    return toDayDTO(day);
  }
}
