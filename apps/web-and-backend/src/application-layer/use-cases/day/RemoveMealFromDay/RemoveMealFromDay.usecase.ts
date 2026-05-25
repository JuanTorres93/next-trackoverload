import { logNoTest } from "@/domain/utils/logNoTest";

import { NotFoundError } from "../../../../domain/common/errors";
import { DaysRepo } from "../../../../domain/repos/DaysRepo.port";
import { MealsRepo } from "../../../../domain/repos/MealsRepo.port";
import { UsersRepo } from "../../../../domain/repos/UsersRepo.port";
import { DayDTO, toDayDTO } from "../../../dtos/DayDTO";
import { TransactionContext } from "../../../ports/TransactionContext.port";

export type RemoveMealFromDayUsecaseRequest = {
  dayId: string;
  userId: string;
  mealId: string;
};

export class RemoveMealFromDayUsecase {
  constructor(
    private daysRepo: DaysRepo,
    private usersRepo: UsersRepo,
    private mealsRepo: MealsRepo,
    private transactionContext: TransactionContext,
  ) {}

  async execute(request: RemoveMealFromDayUsecaseRequest): Promise<DayDTO> {
    const [user, day] = await Promise.all([
      this.usersRepo.getUserById(request.userId),

      this.daysRepo.getDayByIdAndUserId(request.dayId, request.userId),
    ]);

    if (!user) {
      logNoTest(
        `RemoveMealFromDayUsecase: User with id ${request.userId} not found`,
      );

      throw new NotFoundError("El usuario no existe");
    }

    if (!day) {
      logNoTest(
        `RemoveMealFromDayUsecase: Day with id ${request.dayId} not found for userId ${request.userId}`,
      );

      throw new NotFoundError("El día no existe.");
    }

    day.removeMealById(request.mealId);

    await this.transactionContext.run(async () => {
      await this.mealsRepo.deleteMeal(request.mealId);
      await this.daysRepo.saveDay(day);
    });

    return toDayDTO(day);
  }
}
