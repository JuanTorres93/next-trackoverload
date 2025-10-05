import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { Day } from '@/domain/entities/day/Day';
import { validateDate } from '@/domain/common/validation';

export type GetDayByIdUsecaseRequest = {
  date: Date;
};

export class GetDayByIdUsecase {
  constructor(private daysRepo: DaysRepo) {}

  async execute(request: GetDayByIdUsecaseRequest): Promise<Day | null> {
    validateDate(request.date, 'GetDayByIdUsecase date');

    const day = await this.daysRepo.getDayById(request.date.toISOString());
    return day || null;
  }
}
