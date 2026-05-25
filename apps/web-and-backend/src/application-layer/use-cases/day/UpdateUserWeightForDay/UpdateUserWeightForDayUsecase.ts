import { logNoTest } from "@/domain/utils/logNoTest";

import { NotFoundError } from "../../../../domain/common/errors";
import { Day } from "../../../../domain/entities/day/Day";
import { DaysRepo } from "../../../../domain/repos/DaysRepo.port";
import { UsersRepo } from "../../../../domain/repos/UsersRepo.port";
import { dayIdToDayMonthYear } from "../../../../domain/value-objects/DayId/DayId";
import { DayDTO, toDayDTO } from "../../../dtos/DayDTO";
import { createDayNoSaveInRepo } from "../common/createDayNoSaveInRepo";

export type UpdateUserWeightForDayUsecaseRequest = {
  userId: string;
  newWeightInKg: number;
  dayId: string;
};

export class UpdateUserWeightForDayUsecase {
  constructor(
    private daysRepo: DaysRepo,
    private usersRepo: UsersRepo,
  ) {}

  async execute(
    request: UpdateUserWeightForDayUsecaseRequest,
  ): Promise<DayDTO> {
    const [user, fetchedDay] = await Promise.all([
      this.usersRepo.getUserById(request.userId),

      this.daysRepo.getDayByIdAndUserId(request.dayId, request.userId),
    ]);

    if (!user) {
      logNoTest(
        `UpdateUserWeightForDayUsecase: User with id ${request.userId} not found`,
      );

      throw new NotFoundError("El usuario no existe.");
    }

    let dayToChangeWeight: Day | null = fetchedDay;

    if (!dayToChangeWeight) {
      const { day, month, year } = dayIdToDayMonthYear(request.dayId);

      dayToChangeWeight = await createDayNoSaveInRepo(
        this.usersRepo,
        this.daysRepo,
        {
          day,
          month,
          year,
          actorUserId: request.userId,
          targetUserId: request.userId,
        },
      );
    }

    dayToChangeWeight.updateUserWeightInKg(request.newWeightInKg);

    await this.daysRepo.saveDay(dayToChangeWeight);

    return toDayDTO(dayToChangeWeight);
  }
}
