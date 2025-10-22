import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { Day } from '@/domain/entities/day/Day';
import { ValidationError } from '@/domain/common/errors';
import {
  validateDate,
  validateNonEmptyString,
} from '@/domain/common/validation';

export type GetDaysByDateRangeUsecaseRequest = {
  startDate: Date;
  endDate: Date;
  userId: string;
};

export class GetDaysByDateRangeUsecase {
  constructor(private daysRepo: DaysRepo) {}

  async execute(request: GetDaysByDateRangeUsecaseRequest): Promise<Day[]> {
    validateDate(request.startDate, 'GetDaysByDateRangeUsecase startDate');
    validateDate(request.endDate, 'GetDaysByDateRangeUsecase endDate');
    validateNonEmptyString(request.userId, 'GetDaysByDateRangeUsecase userId');

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

    return days || [];
  }
}
