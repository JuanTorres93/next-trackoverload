import { DayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';
import { NotFoundError } from '@/domain/common/errors';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { dateToDayId } from '@/domain/value-objects/DayId/DayId';

export type GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecaseRequest =
  {
    numberOfDays: number;
    userId: string;
  };

export type DayEntry = {
  date: string;
  day: DayDTO | null;
};

export class GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecase {
  constructor(
    private daysRepo: DaysRepo,
    private usersRepo: UsersRepo,
  ) {}

  async execute(
    request: GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecaseRequest,
  ): Promise<DayEntry[]> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecase: User with id ${request.userId} not found`,
      );
    }

    const today = new Date();

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (request.numberOfDays - 1));

    const todayDayId = dateToDayId(today).value;
    const startDayId = dateToDayId(startDate).value;

    const days = await this.daysRepo.getDaysByDateRangeAndUserId(
      startDayId,
      todayDayId,
      request.userId,
    );

    const dayMap = new Map(days.map((day) => [day.id, toDayDTO(day)]));

    return Array.from({ length: request.numberOfDays }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const dayId = dateToDayId(date).value;

      return { date: dayId, day: dayMap.get(dayId) ?? null };
    });
  }
}
