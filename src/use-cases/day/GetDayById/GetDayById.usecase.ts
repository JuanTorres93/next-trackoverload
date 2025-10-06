import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { Day } from '@/domain/entities/day/Day';
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

  async execute(request: GetDayByIdUsecaseRequest): Promise<Day | null> {
    validateDate(request.date, 'GetDayByIdUsecase date');
    validateNonEmptyString(request.userId, 'GetDayByIdUsecase userId');

    const day = await this.daysRepo.getDayByIdAndUserId(
      request.date.toISOString(),
      request.userId
    );

    return day || null;
  }
}
