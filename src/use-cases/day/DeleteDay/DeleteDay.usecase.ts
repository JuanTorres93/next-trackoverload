import { NotFoundError } from '@/domain/common/errors';
import { validateDate } from '@/domain/common/validation';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';

export type DeleteDayUsecaseRequest = {
  date: Date;
};

export class DeleteDayUsecase {
  constructor(private daysRepo: DaysRepo) {}

  async execute(request: DeleteDayUsecaseRequest): Promise<void> {
    validateDate(request.date, 'DeleteDayUsecase date');

    const day = await this.daysRepo.getDayById(request.date.toISOString());
    if (!day) {
      throw new NotFoundError('DeleteDayUsecase: Day not found');
    }

    await this.daysRepo.deleteDay(request.date.toISOString());
  }
}
