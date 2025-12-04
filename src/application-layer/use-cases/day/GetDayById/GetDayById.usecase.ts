import { DayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';
import { NotFoundError } from '@/domain/common/errors';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type GetDayByIdUsecaseRequest = {
  dayId: string;
  userId: string;
};

export class GetDayByIdUsecase {
  constructor(private daysRepo: DaysRepo, private usersRepo: UsersRepo) {}

  async execute(request: GetDayByIdUsecaseRequest): Promise<DayDTO | null> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `GetDayById usecase: User with id ${request.userId} not found`
      );
    }

    const day = await this.daysRepo.getDayByIdAndUserId(
      request.dayId,
      request.userId
    );

    if (!day) return null;

    return toDayDTO(day);
  }
}
