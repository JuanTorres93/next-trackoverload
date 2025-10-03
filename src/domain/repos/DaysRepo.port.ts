import { Day } from '../entities/day/Day';

export interface DaysRepo {
  getAllDays(): Promise<Day[]>;
  getDayById(id: string): Promise<Day | null>;
  saveDay(day: Day): Promise<void>;
  deleteDay(id: string): Promise<void>;
}
