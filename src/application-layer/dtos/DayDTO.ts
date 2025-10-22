import { Day } from '@/domain/entities/day/Day';
import { Meal } from '@/domain/entities/meal/Meal';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { MealDTO, toMealDTO } from './MealDTO';
import { FakeMealDTO, toFakeMealDTO } from './FakeMealDTO';

export type DayDTO = {
  id: string; // Date as ISO string
  userId: string;
  meals: (MealDTO | FakeMealDTO)[];
  createdAt: string;
  updatedAt: string;
};

export function toDayDTO(day: Day): DayDTO {
  return {
    id: day.id.toISOString(),
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
    createdAt: day.createdAt.toISOString(),
    updatedAt: day.updatedAt.toISOString(),
  };
}
