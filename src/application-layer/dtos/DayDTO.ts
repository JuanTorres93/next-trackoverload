import { Day } from '@/domain/entities/day/Day';
import { Meal } from '@/domain/entities/meal/Meal';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { MealDTO, toMealDTO } from './MealDTO';
import { FakeMealDTO, toFakeMealDTO } from './FakeMealDTO';

export type DayDTO = {
  id: string; // Date as YYYYMMDD
  userId: string;
  meals: (MealDTO | FakeMealDTO)[];
  calories: number;
  protein: number;
  createdAt: string;
  day: number;
  month: number;
  year: number;
  updatedAt: string;
};

export function toDayDTO(day: Day): DayDTO {
  return {
    id: day.id,
    userId: day.userId,
    meals: day.meals.map((meal) => {
      if (meal instanceof Meal) {
        return toMealDTO(meal);
      } else if (meal instanceof FakeMeal) {
        return toFakeMealDTO(meal);
      } else {
        throw new Error('Unknown meal type in Day');
      }
    }),
    calories: day.calories,
    protein: day.protein,
    day: day.day,
    month: day.month,
    year: day.year,
    createdAt: day.createdAt.toISOString(),
    updatedAt: day.updatedAt.toISOString(),
  };
}
