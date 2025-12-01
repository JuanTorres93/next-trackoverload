import { Day } from '../entities/day/Day';

export interface DaysRepo {
  getAllDays(): Promise<Day[]>;
  getAllDaysByUserId(userId: string): Promise<Day[]>;
  getDayById(id: string): Promise<Day | null>;
  getDayByIdAndUserId(id: string, userId: string): Promise<Day | null>;
  getDaysByDateRange(startDate: string, endDate: string): Promise<Day[]>;
  getDaysByDateRangeAndUserId(
    startDate: string,
    endDate: string,
    userId: string
  ): Promise<Day[]>;
  saveDay(day: Day): Promise<void>;
  // TODO IMPORTANT: Refactor to remove day from user
  deleteDay(id: string): Promise<void>;
}
