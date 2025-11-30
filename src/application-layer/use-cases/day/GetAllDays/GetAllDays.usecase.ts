import { DayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';

export type GetAllDaysUsecaseRequest = {
  userId: string;
};

export class GetAllDaysUsecase {
  constructor(private daysRepo: DaysRepo) {}

  async execute(request: GetAllDaysUsecaseRequest): Promise<DayDTO[]> {
    const days = await this.daysRepo.getAllDaysByUserId(request.userId);
    return days.map(toDayDTO) || [];
  }
}
