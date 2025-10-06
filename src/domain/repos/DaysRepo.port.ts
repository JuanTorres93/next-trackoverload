import { Day } from '../entities/day/Day';

export interface DaysRepo {
  getAllDays(): Promise<Day[]>;
  getAllDaysByUserId(userId: string): Promise<Day[]>;
  getDayById(id: string): Promise<Day | null>;
  getDayByIdAndUserId(id: string, userId: string): Promise<Day | null>;
  getDaysByDateRange(startDate: Date, endDate: Date): Promise<Day[]>;
  getDaysByDateRangeAndUserId(
    startDate: Date,
    endDate: Date,
    userId: string
  ): Promise<Day[]>;
  saveDay(day: Day): Promise<void>;
  deleteDay(id: string): Promise<void>;
}
