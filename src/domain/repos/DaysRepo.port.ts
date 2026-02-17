import { Day } from '../entities/day/Day';

export interface DaysRepo {
  getAllDays(): Promise<Day[]>;
  getDayById(id: string): Promise<Day | null>;

  getAllDaysByUserId(userId: string): Promise<Day[]>;
  getDayByIdAndUserId(id: string, userId: string): Promise<Day | null>;
  getMultipleDaysByIdsAndUserId(ids: string[], userId: string): Promise<Day[]>;

  getDaysByDateRange(startDayId: string, endDayId: string): Promise<Day[]>;
  getDaysByDateRangeAndUserId(
    startDayId: string,
    endDayId: string,
    userId: string,
  ): Promise<Day[]>;

  saveDay(day: Day): Promise<void>;

  deleteDayForUser(id: string, userId: string): Promise<void>;
  deleteAllDaysForUser(userId: string): Promise<void>;
}
