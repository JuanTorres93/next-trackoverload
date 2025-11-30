import { DayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';
import { NotFoundError } from '@/domain/common/errors';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type GetAllDaysUsecaseRequest = {
  userId: string;
};

export class GetAllDaysUsecase {
  constructor(private daysRepo: DaysRepo, private usersRepo: UsersRepo) {}

  async execute(request: GetAllDaysUsecaseRequest): Promise<DayDTO[]> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `GetAllDaysUsecase: User with id ${request.userId} not found`
      );
    }

    const days = await this.daysRepo.getAllDaysByUserId(request.userId);
    return days.map(toDayDTO) || [];
  }
}
