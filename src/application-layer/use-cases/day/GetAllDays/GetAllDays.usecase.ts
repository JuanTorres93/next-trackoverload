import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { DayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';
import { validateNonEmptyString } from '@/domain/common/validation';

export type GetAllDaysUsecaseRequest = {
  userId: string;
};

export class GetAllDaysUsecase {
  constructor(private daysRepo: DaysRepo) {}

  async execute(request: GetAllDaysUsecaseRequest): Promise<DayDTO[]> {
    validateNonEmptyString(request.userId, 'GetAllDaysUsecase userId');

    const days = await this.daysRepo.getAllDaysByUserId(request.userId);
    return days.map(toDayDTO) || [];
  }
}
