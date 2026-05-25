import { logNoTest } from "@/domain/utils/logNoTest";

import { NotFoundError } from "../../../../../domain/common/errors";
import { FakeMeal } from "../../../../../domain/entities/fakemeal/FakeMeal";
import { DaysRepo } from "../../../../../domain/repos/DaysRepo.port";
import { FakeMealsRepo } from "../../../../../domain/repos/FakeMealsRepo.port";
import { UsersRepo } from "../../../../../domain/repos/UsersRepo.port";
import { IdGenerator } from "../../../../../domain/services/IdGenerator.port";
import { DayDTO, toDayDTO } from "../../../../dtos/DayDTO";
import { TransactionContext } from "../../../../ports/TransactionContext.port";

export type ReplaceFakeMealByAnotherFakeMealForUserInDayUsecaseRequest = {
  fakeMealIdToReplace: string;
  dayId: string;
  userId: string;
  name: string;
  calories: number;
  protein: number;
};

export class ReplaceFakeMealByAnotherFakeMealForUserInDayUsecase {
  constructor(
    private daysRepo: DaysRepo,
    private usersRepo: UsersRepo,
    private fakeMealsRepo: FakeMealsRepo,
    private idGenerator: IdGenerator,
    private transactionContext: TransactionContext,
  ) {}

  async execute(
    request: ReplaceFakeMealByAnotherFakeMealForUserInDayUsecaseRequest,
  ): Promise<DayDTO> {
    const [user, day] = await Promise.all([
      this.usersRepo.getUserById(request.userId),

      this.daysRepo.getDayByIdAndUserId(request.dayId, request.userId),
    ]);

    if (!user) {
      logNoTest(
        `ReplaceFakeMealByAnotherFakeMealForUserInDayUsecase: User with id ${request.userId} not found`,
      );

      throw new NotFoundError("El usuario no existe.");
    }

    if (!day) {
      logNoTest(
        `ReplaceFakeMealByAnotherFakeMealForUserInDayUsecase: Day with id ${request.dayId} not found for user ${request.userId}`,
      );

      throw new NotFoundError("El día no existe.");
    }

    const newFakeMeal = FakeMeal.create({
      id: this.idGenerator.generateId(),
      userId: request.userId,
      name: request.name,
      calories: request.calories,
      protein: request.protein,
    });

    day.removeFakeMealById(request.fakeMealIdToReplace);
    day.addFakeMeal(newFakeMeal.id);

    await this.transactionContext.run(async () => {
      await this.fakeMealsRepo.deleteFakeMeal(request.fakeMealIdToReplace);
      await this.fakeMealsRepo.saveFakeMeal(newFakeMeal);
      await this.daysRepo.saveDay(day);
    });

    return toDayDTO(day);
  }
}
