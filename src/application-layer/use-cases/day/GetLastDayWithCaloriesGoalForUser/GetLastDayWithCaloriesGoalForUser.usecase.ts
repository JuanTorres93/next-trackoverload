import { DayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';
import { NotFoundError } from '@/domain/common/errors';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

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
      throw new NotFoundError(
        `GetLastDayWithCaloriesGoalForUserUsecase: User with id ${request.userId} not found`,
      );
    }

    return day ? toDayDTO(day) : null;
  }
}
