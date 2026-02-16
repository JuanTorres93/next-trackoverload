import { DayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';
import { NotFoundError } from '@/domain/common/errors';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { TransactionContext } from '@/application-layer/ports/TransactionContext.port';

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
    private transactionContext: TransactionContext,
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

    day.removeFakeMealById(request.fakeMealId);

    await this.transactionContext.run(async () => {
      await this.fakeMealsRepo.deleteFakeMeal(request.fakeMealId);
      await this.daysRepo.saveDay(day);
    });

    return toDayDTO(day);
  }
}
