import { DayDTO } from "shared";

import { logNoTest } from "@/utils/logNoTest";

import { NotFoundError } from "../../../../domain/common/errors";
import { Day } from "../../../../domain/entities/day/Day";
import { DaysRepo } from "../../../../domain/repos/DaysRepo.port";
import { UsersRepo } from "../../../../domain/repos/UsersRepo.port";
import { dayIdToDayMonthYear } from "../../../../domain/value-objects/DayId/DayId";
import { toDayDTO } from "../../../dtos/DayDTO";
import { createDayNoSaveInRepo } from "../common/createDayNoSaveInRepo";

export type SetProteinGoalForDayAndUserUsecaseRequest = {
  dayId: string;
  userId: string;
  newProteinGoal: number;
};

export class SetProteinGoalForDayAndUserUsecase {
  constructor(
    private daysRepo: DaysRepo,
    private usersRepo: UsersRepo,
  ) {}

  async execute(
    request: SetProteinGoalForDayAndUserUsecaseRequest,
  ): Promise<DayDTO> {
    const [user, fetchedDay] = await Promise.all([
      this.usersRepo.getUserById(request.userId),
      this.daysRepo.getDayByIdAndUserId(request.dayId, request.userId),
    ]);

    if (!user) {
      logNoTest(
        `SetProteinGoalForDayAndUserUsecase: User with id ${request.userId} not found`,
      );

      throw new NotFoundError("El usuario no existe.");
    }

    let dayToUpdateProteinGoal: Day | null = fetchedDay;

    if (!dayToUpdateProteinGoal) {
      const { day, month, year } = dayIdToDayMonthYear(request.dayId);

      dayToUpdateProteinGoal = await createDayNoSaveInRepo(
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

    dayToUpdateProteinGoal.updateProteinGoal(request.newProteinGoal);

    await this.daysRepo.saveDay(dayToUpdateProteinGoal);

    return toDayDTO(dayToUpdateProteinGoal);
  }
}
