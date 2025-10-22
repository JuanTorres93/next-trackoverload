import { NotFoundError } from '@/domain/common/errors';
import {
  validateDate,
  validateNonEmptyString,
} from '@/domain/common/validation';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';

export type DeleteDayUsecaseRequest = {
  date: Date;
  userId: string;
};

export class DeleteDayUsecase {
  constructor(private daysRepo: DaysRepo) {}

  async execute(request: DeleteDayUsecaseRequest): Promise<void> {
    validateDate(request.date, 'DeleteDayUsecase date');
    validateNonEmptyString(request.userId, 'DeleteDayUsecase userId');

    const day = await this.daysRepo.getDayByIdAndUserId(
      request.date.toISOString(),
      request.userId
    );
    if (!day) {
      throw new NotFoundError('DeleteDayUsecase: Day not found');
    }

    await this.daysRepo.deleteDay(request.date.toISOString());
  }
}
