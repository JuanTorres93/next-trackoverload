import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { DayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';
import {
  validateDate,
  validateNonEmptyString,
} from '@/domain/common/validation';

export type GetDayByIdUsecaseRequest = {
  date: Date;
  userId: string;
};

export class GetDayByIdUsecase {
  constructor(private daysRepo: DaysRepo) {}

  async execute(request: GetDayByIdUsecaseRequest): Promise<DayDTO | null> {
    validateDate(request.date, 'GetDayByIdUsecase date');
    validateNonEmptyString(request.userId, 'GetDayByIdUsecase userId');

    const day = await this.daysRepo.getDayByIdAndUserId(
      request.date.toISOString(),
      request.userId
    );

    if (!day) return null;

    return toDayDTO(day);
  }
}
