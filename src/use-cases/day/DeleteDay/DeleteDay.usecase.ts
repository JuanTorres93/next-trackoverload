import { NotFoundError, ValidationError } from '@/domain/common/errors';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';

export type DeleteDayUsecaseRequest = {
  date: Date;
};

export class DeleteDayUsecase {
  constructor(private daysRepo: DaysRepo) {}

  async execute(request: DeleteDayUsecaseRequest): Promise<void> {
    if (!(request.date instanceof Date) || isNaN(request.date.getTime())) {
      throw new ValidationError('DeleteDayUsecase: Invalid date');
    }

    const day = await this.daysRepo.getDayById(request.date.toISOString());
    if (!day) {
      throw new NotFoundError('DeleteDayUsecase: Day not found');
    }

    await this.daysRepo.deleteDay(request.date.toISOString());
  }
}
