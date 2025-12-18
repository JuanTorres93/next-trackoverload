import { DayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';
import { NotFoundError } from '@/domain/common/errors';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type RemoveFakeMealFromDayUsecaseRequest = {
  date: string;
  userId: string;
  fakeMealId: string;
};

export class RemoveFakeMealFromDayUsecase {
  constructor(
    private daysRepo: DaysRepo,
    private usersRepo: UsersRepo,
    private fakeMealsRepo: FakeMealsRepo
  ) {}

  async execute(request: RemoveFakeMealFromDayUsecaseRequest): Promise<DayDTO> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `RemoveFakeMealFromDayUsecase: User with id ${request.userId} not found`
      );
    }

    const day = await this.daysRepo.getDayByIdAndUserId(
      request.date,
      request.userId
    );

    if (!day) {
      throw new NotFoundError(
        `RemoveFakeMealFromDayUsecase: Day not found for date ${request.date} and userId ${request.userId}`
      );
    }

    day.removeMealById(request.fakeMealId);
    await this.fakeMealsRepo.deleteFakeMeal(request.fakeMealId);
    await this.daysRepo.saveDay(day);

    return toDayDTO(day);
  }
}
