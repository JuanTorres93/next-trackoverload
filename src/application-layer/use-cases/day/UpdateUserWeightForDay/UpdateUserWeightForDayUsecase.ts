import { DayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';
import { NotFoundError } from '@/domain/common/errors';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

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
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `UpdateUserWeightForDayUsecase: User with id ${request.userId} not found`,
      );
    }

    const day = await this.daysRepo.getDayByIdAndUserId(
      request.dayId,
      request.userId,
    );
    if (!day) {
      throw new NotFoundError(
        `UpdateUserWeightForDayUsecase: Day not found for dayId ${request.dayId} and userId ${request.userId}`,
      );
    }

    day.updateUserWeightInKg(request.newWeightInKg);

    await this.daysRepo.saveDay(day);

    return toDayDTO(day);
  }
}
