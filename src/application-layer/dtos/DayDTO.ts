import { MealDTO } from './MealDTO';
import { FakeMealDTO } from './FakeMealDTO';

export type DayDTO = {
  id: string; // Date as ISO string
  userId: string;
  meals: (MealDTO | FakeMealDTO)[];
  createdAt: string;
  updatedAt: string;
};
