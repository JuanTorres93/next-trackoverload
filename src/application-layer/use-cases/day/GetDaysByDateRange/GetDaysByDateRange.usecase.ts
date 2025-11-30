import { DayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import { validateDate } from '@/domain/common/validation';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type GetDaysByDateRangeUsecaseRequest = {
  startDate: Date;
  endDate: Date;
  userId: string;
};

export class GetDaysByDateRangeUsecase {
  constructor(private daysRepo: DaysRepo, private usersRepo: UsersRepo) {}

  async execute(request: GetDaysByDateRangeUsecaseRequest): Promise<DayDTO[]> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `GetDaysByDateRangeUsecase: User with id ${request.userId} not found`
      );
    }

    validateDate(request.startDate, 'GetDaysByDateRangeUsecase startDate');
    validateDate(request.endDate, 'GetDaysByDateRangeUsecase endDate');

    if (request.startDate > request.endDate) {
      throw new ValidationError(
        'GetDaysByDateRangeUsecase: Start date must be before or equal to end date'
      );
    }

    const days = await this.daysRepo.getDaysByDateRangeAndUserId(
      request.startDate,
      request.endDate,
      request.userId
    );

    return days.map(toDayDTO) || [];
  }
}
