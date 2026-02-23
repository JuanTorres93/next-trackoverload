import { Day } from '@/domain/entities/day/Day';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';

export class MemoryDaysRepo implements DaysRepo {
  private days: Day[] = [];

  async saveDay(day: Day): Promise<void> {
    const existingIndex = this.days.findIndex((d) => d.id === day.id);

    if (existingIndex !== -1) {
      this.days[existingIndex] = day;
    } else {
      this.days.push(day);
    }
  }

  async saveMultipleDays(days: Day[]): Promise<void> {
    await Promise.all(days.map((day) => this.saveDay(day)));
  }

  async getAllDays(): Promise<Day[]> {
    return [...this.days];
  }

  async getAllDaysByUserId(userId: string): Promise<Day[]> {
    return this.days.filter((day) => day.userId === userId);
  }

  async getDayById(id: string): Promise<Day | null> {
    const day = this.days.find((d) => d.id === id);
    return day || null;
  }

  async getDayByIdAndUserId(id: string, userId: string): Promise<Day | null> {
    const day = this.days.find((day) => day.id === id && day.userId === userId);
    return day || null;
  }

  async getMultipleDaysByIdsAndUserId(
    ids: string[],
    userId: string,
  ): Promise<Day[]> {
    return this.days.filter(
      (day) => ids.includes(day.id) && day.userId === userId,
    );
  }

  async getDaysByDateRange(
    startDayId: string,
    endDayId: string,
  ): Promise<Day[]> {
    return this.days.filter((day) => {
      const dayTime = day.id;
      return dayTime >= startDayId && dayTime <= endDayId;
    });
  }

  async getDaysByDateRangeAndUserId(
    startDayId: string,
    endDayId: string,
    userId: string,
  ): Promise<Day[]> {
    return this.days.filter((day) => {
      const dayTime = day.id;
      return (
        dayTime >= startDayId && dayTime <= endDayId && day.userId === userId
      );
    });
  }

  async deleteDayForUser(id: string, userId: string): Promise<void> {
    const index = this.days.findIndex(
      (d) => d.id === id && d.userId === userId,
    );

    if (index !== -1) {
      this.days.splice(index, 1);
    }
    // No error for non-existent days - consistent with other repos
  }

  async deleteAllDaysForUser(userId: string): Promise<void> {
    this.days = this.days.filter((d) => d.userId !== userId);
  }

  // IMPORTANT NOTE: Helper method for testing - not part of the interface
  clearForTesting(): void {
    this.days = [];
  }

  // IMPORTANT NOTE: Helper method for testing - not part of the interface
  countForTesting(): number {
    return this.days.length;
  }

  // IMPORTANT NOTE: Helper method for testing - not part of the interface
  getAllForTesting(): Day[] {
    return [...this.days];
  }
}
