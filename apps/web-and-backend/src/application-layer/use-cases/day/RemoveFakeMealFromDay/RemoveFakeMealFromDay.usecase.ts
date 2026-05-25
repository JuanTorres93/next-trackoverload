import { logNoTest } from "@/utils/logNoTest";

import { NotFoundError } from "../../../../domain/common/errors";
import { DaysRepo } from "../../../../domain/repos/DaysRepo.port";
import { FakeMealsRepo } from "../../../../domain/repos/FakeMealsRepo.port";
import { UsersRepo } from "../../../../domain/repos/UsersRepo.port";
import { DayDTO, toDayDTO } from "../../../dtos/DayDTO";
import { TransactionContext } from "../../../ports/TransactionContext.port";

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
    const [user, day] = await Promise.all([
      this.usersRepo.getUserById(request.userId),

      this.daysRepo.getDayByIdAndUserId(request.dayId, request.userId),
    ]);

    if (!user) {
      logNoTest(
        `RemoveFakeMealFromDayUsecase: User with id ${request.userId} not found`,
      );

      throw new NotFoundError("El usuario no existe");
    }

    if (!day) {
      logNoTest(
        `RemoveFakeMealFromDayUsecase: Day not found for dayId ${request.dayId} and userId ${request.userId}`,
      );

      throw new NotFoundError("El día no existe");
    }

    day.removeFakeMealById(request.fakeMealId);

    await this.transactionContext.run(async () => {
      await this.fakeMealsRepo.deleteFakeMeal(request.fakeMealId);
      await this.daysRepo.saveDay(day);
    });

    return toDayDTO(day);
  }
}
