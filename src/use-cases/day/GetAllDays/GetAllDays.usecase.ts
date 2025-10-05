import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { Day } from '@/domain/entities/day/Day';

export class GetAllDaysUsecase {
  constructor(private daysRepo: DaysRepo) {}

  async execute(): Promise<Day[]> {
    const days = await this.daysRepo.getAllDays();
    return days || [];
  }
}
