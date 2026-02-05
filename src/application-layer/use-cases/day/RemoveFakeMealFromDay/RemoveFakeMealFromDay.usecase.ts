import { DayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';
import { NotFoundError } from '@/domain/common/errors';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { UnitOfWork } from '@/application-layer/unit-of-work/UnitOfWork.port';

export type RemoveFakeMealFromDayUsecaseRequest = {
  dayId: string;
  userId: string;
  fakeMealId: string;
};

export class RemoveFakeMealFromDayUsecase {
  constructor(
    private daysRepo: DaysRepo,
    private usersRepo: UsersRepo,
    private fakeMealsRepo: FakeMealsRepo,
    private unitOfWork: UnitOfWork,
  ) {}

  async execute(request: RemoveFakeMealFromDayUsecaseRequest): Promise<DayDTO> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `RemoveFakeMealFromDayUsecase: User with id ${request.userId} not found`,
      );
    }

    const day = await this.daysRepo.getDayByIdAndUserId(
      request.dayId,
      request.userId,
    );

    if (!day) {
      throw new NotFoundError(
        `RemoveFakeMealFromDayUsecase: Day not found for dayId ${request.dayId} and userId ${request.userId}`,
      );
    }

    day.removeMealById(request.fakeMealId);

    await this.unitOfWork.inTransaction(async () => {
      await this.fakeMealsRepo.deleteFakeMeal(request.fakeMealId);
      await this.daysRepo.saveDay(day);
    });

    return toDayDTO(day);
  }
}
