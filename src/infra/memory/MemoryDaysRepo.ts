import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { Day } from '@/domain/entities/day/Day';
import { NotFoundError } from '@/domain/common/errors';

export class MemoryDaysRepo implements DaysRepo {
  private days: Day[] = [];

  async saveDay(day: Day): Promise<void> {
    const existingIndex = this.days.findIndex(
      (d) => d.id.getTime() === day.id.getTime()
    );

    if (existingIndex !== -1) {
      this.days[existingIndex] = day;
    } else {
      this.days.push(day);
    }
  }

  async getAllDays(): Promise<Day[]> {
    return [...this.days];
  }

  async getDayById(id: string): Promise<Day | null> {
    const dayDate = new Date(id);
    const day = this.days.find((d) => d.id.getTime() === dayDate.getTime());
    return day || null;
  }

  async deleteDay(id: string): Promise<void> {
    const dayDate = new Date(id);
    const index = this.days.findIndex(
      (d) => d.id.getTime() === dayDate.getTime()
    );
    if (index === -1) throw new NotFoundError('MemoryDaysRepo: Day not found');

    this.days.splice(index, 1);
  }
}
