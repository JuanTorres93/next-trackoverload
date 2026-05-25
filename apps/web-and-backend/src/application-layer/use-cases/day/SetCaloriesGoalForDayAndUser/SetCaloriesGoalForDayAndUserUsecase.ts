import { logNoTest } from "@/utils/logNoTest";

import { DayDTO, toDayDTO } from '../../../dtos/DayDTO';
import { NotFoundError } from '../../../../domain/common/errors';
import { Day } from '../../../../domain/entities/day/Day';
import { DaysRepo } from '../../../../domain/repos/DaysRepo.port';
import { UsersRepo } from '../../../../domain/repos/UsersRepo.port';
import { dayIdToDayMonthYear } from '../../../../domain/value-objects/DayId/DayId';
import { createDayNoSaveInRepo } from '../common/createDayNoSaveInRepo';

export type SetCaloriesGoalForDayAndUserUsecaseRequest = {
  dayId: string;
  userId: string;
  newCaloriesGoal: number;
};

export class SetCaloriesGoalForDayAndUserUsecase {
  constructor(
    private daysRepo: DaysRepo,
    private usersRepo: UsersRepo,
  ) {}

  async execute(
    request: SetCaloriesGoalForDayAndUserUsecaseRequest,
  ): Promise<DayDTO> {
    const [user, fetchedDay] = await Promise.all([
      this.usersRepo.getUserById(request.userId),
      this.daysRepo.getDayByIdAndUserId(request.dayId, request.userId),
    ]);

    if (!user) {
      logNoTest(
        `SetCaloriesGoalForDayAndUserUsecase: User with id ${request.userId} not found`,
      );

      throw new NotFoundError("El usuario no existe.");
    }

    let dayToUpdateCaloriesGoal: Day | null = fetchedDay;

    if (!dayToUpdateCaloriesGoal) {
      const { day, month, year } = dayIdToDayMonthYear(request.dayId);

      dayToUpdateCaloriesGoal = await createDayNoSaveInRepo(
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

    dayToUpdateCaloriesGoal.updateCaloriesGoal(request.newCaloriesGoal);

    await this.daysRepo.saveDay(dayToUpdateCaloriesGoal);

    return toDayDTO(dayToUpdateCaloriesGoal);
  }
}
