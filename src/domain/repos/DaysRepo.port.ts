import { Day } from '../entities/day/Day';

export interface DaysRepo {
  getAllDays(): Promise<Day[]>;
  getAllDaysByUserId(userId: string): Promise<Day[]>;
  getDayById(id: string): Promise<Day | null>;
  getDayByIdAndUserId(id: string, userId: string): Promise<Day | null>;
  getDaysByDateRange(startDayId: string, endDayId: string): Promise<Day[]>;
  getDaysByDateRangeAndUserId(
    startDayId: string,
    endDayId: string,
    userId: string
  ): Promise<Day[]>;
  saveDay(day: Day): Promise<void>;
  deleteDayForUser(id: string, userId: string): Promise<void>;
}
