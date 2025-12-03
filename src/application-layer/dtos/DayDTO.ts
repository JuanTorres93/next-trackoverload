import { Day } from '@/domain/entities/day/Day';
import { Meal } from '@/domain/entities/meal/Meal';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { MealDTO, toMealDTO, fromMealDTO } from './MealDTO';
import { FakeMealDTO, toFakeMealDTO, fromFakeMealDTO } from './FakeMealDTO';
import { dayIdToDayMonthYear } from '@/domain/value-objects/DayId/DayId';

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

export function fromDayDTO(dto: DayDTO): Day {
  const meals: (Meal | FakeMeal)[] = dto.meals.map((mealDTO) => {
    // Check if it's a MealDTO by presence of ingredientLines property
    if ('ingredientLines' in mealDTO) {
      return fromMealDTO(mealDTO as MealDTO);
    } else {
      return fromFakeMealDTO(mealDTO as FakeMealDTO);
    }
  });

  return Day.create({
    ...dayIdToDayMonthYear(dto.id),
    userId: dto.userId,
    meals,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  });
}
