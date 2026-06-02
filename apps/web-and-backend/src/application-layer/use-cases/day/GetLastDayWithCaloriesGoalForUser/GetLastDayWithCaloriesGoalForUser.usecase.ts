import { DayDTO } from "shared";

import { logNoTest } from "@/utils/logNoTest";

import { NotFoundError } from "../../../../domain/common/errors";
import { DaysRepo } from "../../../../domain/repos/DaysRepo.port";
import { UsersRepo } from "../../../../domain/repos/UsersRepo.port";
import { toDayDTO } from "../../../dtos/DayDTO";

export type GetLastDayWithCaloriesGoalForUserRequest = {
  userId: string;
};

export class GetLastDayWithCaloriesGoalForUserUsecase {
  constructor(
    private daysRepo: DaysRepo,
    private usersRepo: UsersRepo,
  ) {}

  async execute(
    request: GetLastDayWithCaloriesGoalForUserRequest,
  ): Promise<DayDTO | null> {
    const [user, day] = await Promise.all([
      this.usersRepo.getUserById(request.userId),

      this.daysRepo.getLastDayWithCaloriesGoalForUser(request.userId),
    ]);

    if (!user) {
      logNoTest(
        `GetLastDayWithCaloriesGoalForUserUsecase: User with id ${request.userId} not found`,
      );

      throw new NotFoundError("El usuario no existe");
    }

    return day ? toDayDTO(day) : null;
  }
}
